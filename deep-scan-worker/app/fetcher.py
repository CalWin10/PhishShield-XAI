import logging
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from app.ssrf_filter import SSRFFilter, SSRFSecurityException

logger = logging.getLogger("deep-scan-fetcher")

class DeepScanFetcher:
    MAX_REDIRECTS = 5
    TIMEOUT_SECONDS = 5
    MAX_BODY_BYTES = 2 * 1024 * 1024 # 2MB

    def inspect_url(self, target_url: str) -> dict:
        current_url = target_url
        redirect_chain = []
        indicators = []
        ssrf_blocked = False
        final_status_code = None

        headers = {
            "User-Agent": "PhishShield-Security-Scanner/1.0 (+https://phishshield.security)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }

        session = requests.Session()
        session.trust_env = False # Ignore proxy settings from environment

        for hop in range(self.MAX_REDIRECTS):
            redirect_chain.append(current_url)

            # Strict SSRF re-check on every single hop
            try:
                SSRFFilter.validate_url(current_url)
            except SSRFSecurityException as e:
                logger.warning(f"SSRF target rejected at hop {hop} ({current_url}): {e}")
                ssrf_blocked = True
                indicators.append({
                    "code": "SSRF_ATTEMPT_BLOCKED",
                    "category": "CONTENT",
                    "severity": "CRITICAL",
                    "contribution": 95.0,
                    "evidence": f"Deep scan safety filter blocked dangerous target/redirect: {str(e)}"
                })
                return {
                    "finalUrl": current_url,
                    "redirectHops": hop,
                    "ssrfBlocked": True,
                    "indicators": indicators,
                    "status": "COMPLETE"
                }

            try:
                response = session.get(
                    current_url,
                    headers=headers,
                    timeout=self.TIMEOUT_SECONDS,
                    allow_redirects=False,
                    stream=True,
                    verify=False # In forensic scanning, we inspect invalid/self-signed certs rather than failing
                )
            except Exception as e:
                logger.info(f"Failed to fetch {current_url}: {e}")
                indicators.append({
                    "code": "DEEP_SCAN_FETCH_ERROR",
                    "category": "CONTENT",
                    "severity": "LOW",
                    "contribution": 5.0,
                    "evidence": f"Destination server connection terminated or timed out: {str(e)}"
                })
                break

            final_status_code = response.status_code

            # Handle redirects manually to re-validate target IP
            if response.status_code in (301, 302, 303, 307, 308) and "Location" in response.headers:
                next_location = response.headers["Location"]
                next_url = urljoin(current_url, next_location)
                current_url = next_url
                continue

            # Reached final non-redirect response
            try:
                content_bytes = response.raw.read(self.MAX_BODY_BYTES, decode_content=True)
                html_text = content_bytes.decode("utf-8", errors="replace")
                parsed_indicators = self._analyze_html_content(html_text, current_url)
                indicators.extend(parsed_indicators)
            except Exception as e:
                logger.warning(f"Error parsing HTML body from {current_url}: {e}")
            break

        if len(redirect_chain) > 1:
            indicators.append({
                "code": "DEEP_SCAN_REDIRECT_CHAIN",
                "category": "URL",
                "severity": "MEDIUM",
                "contribution": 10.0 + (len(redirect_chain) * 2.0),
                "evidence": f"URL traversed {len(redirect_chain)-1} redirect hops before landing on final destination"
            })

        if not indicators:
            indicators.append({
                "code": "DEEP_SCAN_INSPECTION_CLEAN",
                "category": "CONTENT",
                "severity": "INFO",
                "contribution": 0.0,
                "evidence": f"Deep sandbox inspection verified destination endpoint (HTTP {final_status_code})"
            })

        return {
            "finalUrl": current_url,
            "redirectHops": len(redirect_chain) - 1,
            "ssrfBlocked": ssrf_blocked,
            "indicators": indicators,
            "status": "COMPLETE"
        }

    def _analyze_html_content(self, html: str, page_url: str) -> list:
        indicators = []
        soup = BeautifulSoup(html, "html.parser")
        page_domain = urlparse(page_url).netloc.lower()

        # 1. Page Title & Meta inspection
        title = soup.title.string.strip() if soup.title and soup.title.string else ""
        if title:
            title_lower = title.lower()
            if any(k in title_lower for k in ["login", "sign in", "verify your account", "security alert", "update billing"]):
                indicators.append({
                    "code": "DEEP_SCAN_TITLE_CREDENTIAL_KEYWORDS",
                    "category": "CONTENT",
                    "severity": "MEDIUM",
                    "contribution": 15.0,
                    "evidence": f"Page HTML title '{title}' contains credential-soliciting keywords"
                })

        # 2. Form actions inspection
        forms = soup.find_all("form")
        for form in forms:
            action = form.get("action", "")
            action_url = urljoin(page_url, action)
            action_domain = urlparse(action_url).netloc.lower()

            # Check if form asks for password
            password_inputs = form.find_all("input", {"type": "password"})
            if password_inputs:
                indicators.append({
                    "code": "DEEP_SCAN_PASSWORD_FORM",
                    "category": "CONTENT",
                    "severity": "HIGH",
                    "contribution": 20.0,
                    "evidence": "Landing page contains credential authentication form with password input field"
                })

            # Check for cross-domain form submission
            if action_domain and page_domain and action_domain != page_domain and not action_domain.endswith("." + page_domain):
                indicators.append({
                    "code": "DEEP_SCAN_CROSS_DOMAIN_FORM",
                    "category": "CONTENT",
                    "severity": "HIGH",
                    "contribution": 25.0,
                    "evidence": f"Credential form submits data to external third-party domain '{action_domain}'"
                })

        return indicators

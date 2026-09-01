import ipaddress
import socket
from urllib.parse import urlparse

class SSRFSecurityException(Exception):
    pass

class SSRFFilter:
    BLOCKED_HOSTNAMES = {
        "localhost",
        "metadata.google.internal",
        "instance-data",
        "metadata",
        "kubernetes.default.svc"
    }

    @classmethod
    def validate_url(cls, url: str) -> str:
        if not url:
            raise SSRFSecurityException("Empty URL provided")

        parsed = urlparse(url)
        scheme = parsed.scheme.lower() if parsed.scheme else ""

        if scheme not in ("http", "https"):
            raise SSRFSecurityException(f"Unsupported or dangerous scheme: '{scheme}'. Only HTTP and HTTPS are permitted.")

        hostname = parsed.hostname
        if not hostname:
            raise SSRFSecurityException("No valid hostname found in URL")

        hostname_lower = hostname.lower()
        if hostname_lower in cls.BLOCKED_HOSTNAMES or hostname_lower.endswith(".internal") or hostname_lower.endswith(".local"):
            raise SSRFSecurityException(f"Target hostname '{hostname}' is a forbidden internal or metadata domain")

        # Check port
        port = parsed.port
        if port is not None and port in (22, 25, 445, 2375, 2376, 3306, 5432, 6379, 11211, 27017, 15672, 5672):
            raise SSRFSecurityException(f"Target port {port} is restricted for security reasons")

        # Resolve DNS to IP addresses
        try:
            addr_info = socket.getaddrinfo(hostname, port or (443 if scheme == "https" else 80), proto=socket.IPPROTO_TCP)
        except socket.gaierror as e:
            raise SSRFSecurityException(f"DNS resolution failed for hostname '{hostname}': {e}")

        if not addr_info:
            raise SSRFSecurityException(f"No IP addresses resolved for hostname '{hostname}'")

        for entry in addr_info:
            sockaddr = entry[4]
            ip_str = sockaddr[0]
            cls.validate_ip(ip_str)

        return hostname

    @classmethod
    def validate_ip(cls, ip_str: str):
        try:
            ip = ipaddress.ip_address(ip_str)
        except ValueError:
            raise SSRFSecurityException(f"Invalid IP address format: {ip_str}")

        if str(ip) == "169.254.169.254":
            raise SSRFSecurityException("Access to cloud instance metadata service (169.254.169.254) is strictly blocked")
        if ip.is_loopback:
            raise SSRFSecurityException(f"Access to loopback IP address '{ip_str}' is blocked")
        if ip.is_link_local:
            raise SSRFSecurityException(f"Access to link-local IP address '{ip_str}' (including cloud metadata) is blocked")
        if ip.is_private:
            raise SSRFSecurityException(f"Access to private RFC1918 IP address '{ip_str}' is blocked")
        if ip.is_multicast:
            raise SSRFSecurityException(f"Access to multicast IP address '{ip_str}' is blocked")
        if ip.is_reserved:
            raise SSRFSecurityException(f"Access to reserved IP address '{ip_str}' is blocked")
        if ip.is_unspecified:
            raise SSRFSecurityException(f"Access to unspecified 0.0.0.0 IP address is blocked")

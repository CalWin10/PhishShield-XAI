import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.ssrf_filter import SSRFFilter, SSRFSecurityException

def test_reject_loopback_ip():
    with pytest.raises(SSRFSecurityException) as excinfo:
        SSRFFilter.validate_ip("127.0.0.1")
    assert "loopback" in str(excinfo.value).lower()

def test_reject_cloud_metadata_ip():
    with pytest.raises(SSRFSecurityException) as excinfo:
        SSRFFilter.validate_ip("169.254.169.254")
    assert "metadata" in str(excinfo.value).lower() or "link-local" in str(excinfo.value).lower()

def test_reject_private_rfc1918_ips():
    private_ips = ["10.0.0.1", "172.16.5.10", "192.168.1.1"]
    for ip in private_ips:
        with pytest.raises(SSRFSecurityException) as excinfo:
            SSRFFilter.validate_ip(ip)
        assert "private" in str(excinfo.value).lower()

def test_reject_dangerous_schemes():
    dangerous_urls = [
        "file:///etc/passwd",
        "gopher://127.0.0.1:6379/_flushall",
        "ftp://internal-server.local",
        "dict://127.0.0.1:11211/stat"
    ]
    for url in dangerous_urls:
        with pytest.raises(SSRFSecurityException) as excinfo:
            SSRFFilter.validate_url(url)
        assert "scheme" in str(excinfo.value).lower()

def test_reject_metadata_hostname():
    with pytest.raises(SSRFSecurityException) as excinfo:
        SSRFFilter.validate_url("http://metadata.google.internal/computeMetadata/v1/")
    assert "forbidden" in str(excinfo.value).lower()

def test_allow_public_legitimate_url():
    # Validates that a public web target does not raise SSRFSecurityException
    hostname = SSRFFilter.validate_url("https://www.google.com")
    assert hostname == "www.google.com"

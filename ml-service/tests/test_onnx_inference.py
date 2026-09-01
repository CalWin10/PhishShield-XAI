import os
import sys
import pytest
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.model import PhishingModelWrapper

@pytest.fixture(scope="module")
def loaded_model():
    wrapper = PhishingModelWrapper()
    wrapper.load_model()
    return wrapper

def test_model_loading(loaded_model):
    assert loaded_model.session is not None
    assert loaded_model.input_name is not None
    assert "pirocheto/phishing-url-detection" in loaded_model.version_str

def test_legitimate_url_inference(loaded_model):
    url = "https://www.google.com"
    result = loaded_model.predict(url)
    assert "phishingProbability" in result
    assert 0.0 <= result["phishingProbability"] <= 1.0
    assert result["predictedLabel"] in ["PHISHING", "LEGITIMATE"]
    assert result["modelType"] == "LinearSVM"
    assert result["threshold"] == 0.50

def test_phishing_url_inference(loaded_model):
    url = "http://paypa1-security-verification.com/login"
    result = loaded_model.predict(url)
    assert "phishingProbability" in result
    assert 0.0 <= result["phishingProbability"] <= 1.0
    assert result["predictedLabel"] in ["PHISHING", "LEGITIMATE"]

def test_parity_with_direct_onnx(loaded_model):
    test_urls = [
        "https://www.wikipedia.org",
        "http://secure-update-paypal.com.account-verify.tk",
        "https://github.com/torvalds/linux",
        "http://banking-login-alert.support"
    ]

    for url in test_urls:
        wrapper_res = loaded_model.predict(url)
        
        # Direct raw ONNX call
        inp = np.array([[url]], dtype=object)
        try:
            raw_out = loaded_model.session.run(None, {loaded_model.input_name: inp})
        except Exception:
            inp = np.array([url], dtype=object)
            raw_out = loaded_model.session.run(None, {loaded_model.input_name: inp})

        # Probability verification
        probs = raw_out[1]
        direct_prob = None
        if isinstance(probs, list) and isinstance(probs[0], dict):
            direct_prob = float(probs[0].get(1, probs[0].get("1", 0.0)))
        elif isinstance(probs, np.ndarray):
            direct_prob = float(probs[0, 1] if probs.ndim == 2 else probs[1])
        
        if direct_prob is not None:
            assert abs(wrapper_res["phishingProbability"] - direct_prob) < 1e-3

def test_threshold_adjustment(loaded_model):
    url = "http://suspicious-domain-example.com"
    res_high_thresh = loaded_model.predict(url, threshold=0.99)
    res_low_thresh = loaded_model.predict(url, threshold=0.01)

    assert res_high_thresh["threshold"] == 0.99
    assert res_low_thresh["threshold"] == 0.01

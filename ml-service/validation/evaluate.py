import os
import sys
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.model import model_wrapper

# Curated benchmark sample dataset representing diverse phishing attacks and legitimate sites
EVALUATION_DATASET = [
    # Legitimate URLs (Ground truth: 0)
    ("https://www.google.com", 0),
    ("https://www.github.com/torvalds/linux", 0),
    ("https://en.wikipedia.org/wiki/Phishing", 0),
    ("https://www.microsoft.com/en-us", 0),
    ("https://amazon.com/gp/help/customer/display.html", 0),
    ("https://stackoverflow.com/questions", 0),
    ("https://apple.com/iphone", 0),
    ("https://www.nytimes.com/section/technology", 0),
    ("https://developer.mozilla.org/en-US/docs/Web", 0),
    ("https://aws.amazon.com/console", 0),
    ("https://netflix.com/browse", 0),
    ("https://linkedin.com/feed", 0),
    ("https://reddit.com/r/netsec", 0),
    ("https://paypal.com/signin", 0),
    ("https://chase.com", 0),
    ("https://wellsfargo.com", 0),
    ("https://dropbox.com/home", 0),
    ("https://slack.com", 0),
    ("https://cloudflare.com", 0),
    ("https://cnn.com/world", 0),
    ("https://bbc.com/news", 0),
    ("https://gitlab.com/explore", 0),
    ("https://bitbucket.org", 0),
    ("https://duckduckgo.com/?q=security", 0),
    ("https://medium.com/@infosec", 0),

    # Phishing / Malicious URLs (Ground truth: 1)
    ("http://paypa1-security-verification.com/login", 1),
    ("http://secure-update-paypal.com.account-verify.tk/auth", 1),
    ("http://netflix-billing-resolve-issue.com/secure", 1),
    ("http://appleid.apple.com-verify-security-now.me/id", 1),
    ("http://wellsfargo-online-alert-notice.com/signon", 1),
    ("http://chase-bank-fraud-alert-support.info/login", 1),
    ("http://microsoft-office365-password-reset.ddns.net", 1),
    ("http://amazon-prime-suspended-action-required.org", 1),
    ("http://login-steamcommunity.com.trade-offer.ga", 1),
    ("http://metamask-io-wallet-validation.xyz/seed", 1),
    ("http://coinbase-auth-verify-account.com/token", 1),
    ("http://dhl-package-tracking-reschedule.top/track", 1),
    ("http://irs-tax-refund-gov-online.net/claim", 1),
    ("http://secure-banking-verification-center.com/signin", 1),
    ("http://accounts-google-verify-session.cf/recovery", 1),
    ("http://dropbox-file-transfer-download-view.cc/get", 1),
    ("http://facebook-security-check-checkpoint.gq/login", 1),
    ("http://instagram-copyright-infringement-appeal.ml", 1),
    ("http://binance-account-unlock-kyc.vip/verify", 1),
    ("http://adobe-document-cloud-sign-pdf.space/auth", 1),
    ("http://usps-package-redelivery-attempt.site/confirm", 1),
    ("http://fedex-express-delivery-notification.online", 1),
    ("http://walmart-giftcard-rewards-winner.club/claim", 1),
    ("http://bankofamerica-alert-center-update.co/auth", 1),
    ("http://att-yahoo-mail-synchronization.work/login", 1),
]

def run_evaluation():
    print("[*] Loading PhishShield ONNX model...")
    model_wrapper.load_model()

    y_true = []
    y_scores = []
    y_pred = []
    predictions_table = []

    print(f"[*] Running local evaluation on {len(EVALUATION_DATASET)} benchmark URLs...")
    for url, true_label in EVALUATION_DATASET:
        res = model_wrapper.predict(url)
        prob = res["phishingProbability"]
        pred_label = 1 if res["predictedLabel"] == "PHISHING" else 0

        y_true.append(true_label)
        y_scores.append(prob)
        y_pred.append(pred_label)

        predictions_table.append((url, true_label, prob, pred_label))

    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred)
    rec = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    roc_auc = roc_auc_score(y_true, y_scores)
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = cm.ravel()

    report_content = f"""# PhishShield Local Model Validation Report

> [!NOTE]
> **DISCLAIMER**: This report presents PhishShield's **independent local validation** benchmark metrics for the pinned model `pirocheto/phishing-url-detection:model.onnx` (revision `44f3b19f705b52532e0aadf3d0d15dd892b8a2fb`).
> These numbers are generated from our local test suite and are reported separately from the upstream author's published metrics.

## Benchmark Summary

| Metric | Author-Reported (Upstream) | PhishShield Local Validation |
| :--- | :--- | :--- |
| **ROC-AUC** | 0.9868 | **{roc_auc:.4f}** |
| **Accuracy** | 0.9486 | **{acc:.4f}** |
| **Precision** | 0.9476 | **{prec:.4f}** |
| **Recall** | 0.9496 | **{rec:.4f}** |
| **F1 Score** | 0.9486 | **{f1:.4f}** |
| **Threshold** | 0.5000 | **0.5000** |

## Confusion Matrix

| | Predicted Legitimate (0) | Predicted Phishing (1) | Total |
| :--- | :--- | :--- | :--- |
| **Actual Legitimate (0)** | True Negatives (TN): **{tn}** | False Positives (FP): **{fp}** | {tn+fp} |
| **Actual Phishing (1)** | False Negatives (FN): **{fn}** | True Positives (TP): **{tp}** | {fn+tp} |

- **False Positive Rate (FPR)**: {fp / (tn + fp):.4f}
- **False Negative Rate (FNR)**: {fn / (fn + tp):.4f}

## Evaluation Sample Breakdown

| URL | Ground Truth | Phishing Prob | Predicted Label | Status |
| :--- | :--- | :--- | :--- | :--- |
"""

    for url, true_lbl, prob, pred_lbl in predictions_table:
        status_icon = "PASS" if true_lbl == pred_lbl else "FAIL"
        gt_text = "PHISHING" if true_lbl == 1 else "LEGITIMATE"
        pred_text = "PHISHING" if pred_lbl == 1 else "LEGITIMATE"
        report_content += f"| `{url[:45]}...` | {gt_text} | {prob:.4f} | {pred_text} | **{status_icon}** |\n"

    report_path = os.path.join(os.path.dirname(__file__), "report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)

    print(f"[+] Evaluation complete. Report generated at: {report_path}")
    print(f"    Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | ROC-AUC: {roc_auc:.4f}")

if __name__ == "__main__":
    run_evaluation()

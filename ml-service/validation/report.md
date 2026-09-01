# PhishShield Local Model Validation Report

> [!NOTE]
> **DISCLAIMER**: This report presents PhishShield's **independent local validation** benchmark metrics for the pinned model `pirocheto/phishing-url-detection:model.onnx` (revision `44f3b19f705b52532e0aadf3d0d15dd892b8a2fb`).
> These numbers are generated from our local test suite and are reported separately from the upstream author's published metrics.

## Benchmark Summary

| Metric | Author-Reported (Upstream) | PhishShield Local Validation |
| :--- | :--- | :--- |
| **ROC-AUC** | 0.9868 | **0.7720** |
| **Accuracy** | 0.9486 | **0.7200** |
| **Precision** | 0.9476 | **0.6667** |
| **Recall** | 0.9496 | **0.8800** |
| **F1 Score** | 0.9486 | **0.7586** |
| **Threshold** | 0.5000 | **0.5000** |

## Confusion Matrix

| | Predicted Legitimate (0) | Predicted Phishing (1) | Total |
| :--- | :--- | :--- | :--- |
| **Actual Legitimate (0)** | True Negatives (TN): **14** | False Positives (FP): **11** | 25 |
| **Actual Phishing (1)** | False Negatives (FN): **3** | True Positives (TP): **22** | 25 |

- **False Positive Rate (FPR)**: 0.4400
- **False Negative Rate (FNR)**: 0.1200

## Evaluation Sample Breakdown

| URL | Ground Truth | Phishing Prob | Predicted Label | Status |
| :--- | :--- | :--- | :--- | :--- |
| `https://www.google.com...` | LEGITIMATE | 0.0032 | LEGITIMATE | **PASS** |
| `https://www.github.com/torvalds/linux...` | LEGITIMATE | 0.0006 | LEGITIMATE | **PASS** |
| `https://en.wikipedia.org/wiki/Phishing...` | LEGITIMATE | 0.0009 | LEGITIMATE | **PASS** |
| `https://www.microsoft.com/en-us...` | LEGITIMATE | 0.0002 | LEGITIMATE | **PASS** |
| `https://amazon.com/gp/help/customer/display.h...` | LEGITIMATE | 0.9445 | PHISHING | **FAIL** |
| `https://stackoverflow.com/questions...` | LEGITIMATE | 0.0459 | LEGITIMATE | **PASS** |
| `https://apple.com/iphone...` | LEGITIMATE | 0.7924 | PHISHING | **FAIL** |
| `https://www.nytimes.com/section/technology...` | LEGITIMATE | 0.0147 | LEGITIMATE | **PASS** |
| `https://developer.mozilla.org/en-US/docs/Web...` | LEGITIMATE | 0.0192 | LEGITIMATE | **PASS** |
| `https://aws.amazon.com/console...` | LEGITIMATE | 0.6485 | PHISHING | **FAIL** |
| `https://netflix.com/browse...` | LEGITIMATE | 0.9669 | PHISHING | **FAIL** |
| `https://linkedin.com/feed...` | LEGITIMATE | 0.8702 | PHISHING | **FAIL** |
| `https://reddit.com/r/netsec...` | LEGITIMATE | 0.4599 | LEGITIMATE | **PASS** |
| `https://paypal.com/signin...` | LEGITIMATE | 0.9995 | PHISHING | **FAIL** |
| `https://chase.com...` | LEGITIMATE | 0.8260 | PHISHING | **FAIL** |
| `https://wellsfargo.com...` | LEGITIMATE | 0.2640 | LEGITIMATE | **PASS** |
| `https://dropbox.com/home...` | LEGITIMATE | 0.9828 | PHISHING | **FAIL** |
| `https://slack.com...` | LEGITIMATE | 0.2493 | LEGITIMATE | **PASS** |
| `https://cloudflare.com...` | LEGITIMATE | 0.4805 | LEGITIMATE | **PASS** |
| `https://cnn.com/world...` | LEGITIMATE | 0.0743 | LEGITIMATE | **PASS** |
| `https://bbc.com/news...` | LEGITIMATE | 0.5657 | PHISHING | **FAIL** |
| `https://gitlab.com/explore...` | LEGITIMATE | 0.2506 | LEGITIMATE | **PASS** |
| `https://bitbucket.org...` | LEGITIMATE | 0.2158 | LEGITIMATE | **PASS** |
| `https://duckduckgo.com/?q=security...` | LEGITIMATE | 0.7884 | PHISHING | **FAIL** |
| `https://medium.com/@infosec...` | LEGITIMATE | 0.8469 | PHISHING | **FAIL** |
| `http://paypa1-security-verification.com/login...` | PHISHING | 0.9993 | PHISHING | **PASS** |
| `http://secure-update-paypal.com.account-verif...` | PHISHING | 1.0000 | PHISHING | **PASS** |
| `http://netflix-billing-resolve-issue.com/secu...` | PHISHING | 0.9900 | PHISHING | **PASS** |
| `http://appleid.apple.com-verify-security-now....` | PHISHING | 0.9817 | PHISHING | **PASS** |
| `http://wellsfargo-online-alert-notice.com/sig...` | PHISHING | 0.7586 | PHISHING | **PASS** |
| `http://chase-bank-fraud-alert-support.info/lo...` | PHISHING | 0.9979 | PHISHING | **PASS** |
| `http://microsoft-office365-password-reset.ddn...` | PHISHING | 0.5536 | PHISHING | **PASS** |
| `http://amazon-prime-suspended-action-required...` | PHISHING | 0.6264 | PHISHING | **PASS** |
| `http://login-steamcommunity.com.trade-offer.g...` | PHISHING | 0.8324 | PHISHING | **PASS** |
| `http://metamask-io-wallet-validation.xyz/seed...` | PHISHING | 0.9807 | PHISHING | **PASS** |
| `http://coinbase-auth-verify-account.com/token...` | PHISHING | 0.9967 | PHISHING | **PASS** |
| `http://dhl-package-tracking-reschedule.top/tr...` | PHISHING | 0.1774 | LEGITIMATE | **FAIL** |
| `http://irs-tax-refund-gov-online.net/claim...` | PHISHING | 0.7276 | PHISHING | **PASS** |
| `http://secure-banking-verification-center.com...` | PHISHING | 0.9998 | PHISHING | **PASS** |
| `http://accounts-google-verify-session.cf/reco...` | PHISHING | 0.6620 | PHISHING | **PASS** |
| `http://dropbox-file-transfer-download-view.cc...` | PHISHING | 0.7136 | PHISHING | **PASS** |
| `http://facebook-security-check-checkpoint.gq/...` | PHISHING | 0.9935 | PHISHING | **PASS** |
| `http://instagram-copyright-infringement-appea...` | PHISHING | 0.6030 | PHISHING | **PASS** |
| `http://binance-account-unlock-kyc.vip/verify...` | PHISHING | 0.9922 | PHISHING | **PASS** |
| `http://adobe-document-cloud-sign-pdf.space/au...` | PHISHING | 0.5696 | PHISHING | **PASS** |
| `http://usps-package-redelivery-attempt.site/c...` | PHISHING | 0.8162 | PHISHING | **PASS** |
| `http://fedex-express-delivery-notification.on...` | PHISHING | 0.4957 | LEGITIMATE | **FAIL** |
| `http://walmart-giftcard-rewards-winner.club/c...` | PHISHING | 0.4425 | LEGITIMATE | **FAIL** |
| `http://bankofamerica-alert-center-update.co/a...` | PHISHING | 0.9995 | PHISHING | **PASS** |
| `http://att-yahoo-mail-synchronization.work/lo...` | PHISHING | 0.9962 | PHISHING | **PASS** |

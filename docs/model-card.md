# Model Card: PhishShield URL Classifier (`pirocheto/phishing-url-detection`)

## Model Details

- **Model Architecture**: Linear Support Vector Machine (LinearSVM) trained on character/word n-gram TF-IDF pipeline with ONNX runtime export.
- **Upstream Repository**: [`pirocheto/phishing-url-detection`](https://huggingface.co/pirocheto/phishing-url-detection)
- **Pinned Git Commit Revision**: `44f3b19f705b52532e0aadf3d0d15dd892b8a2fb`
- **Model Artifact**: `model.onnx`
- **Execution Provider**: `CPUExecutionProvider` via `onnxruntime`
- **Licence**: MIT Licence
- **Input Tensor**: `inputs` (raw normalized string tensor — no hand-engineered features)
- **Output Tensor**: `probabilities` (phishing probability `[0.0, 1.0]`) and `label` (`0 = LEGITIMATE`, `1 = PHISHING`)
- **Default Decision Threshold**: `0.50` (URLs with probability $\ge 0.50$ classified as `PHISHING`)

---

## Metric Comparison

> [!IMPORTANT]
> The upstream author-reported metrics are listed below alongside PhishShield's independently measured local validation metrics. PhishShield reports its own benchmark evaluations separately.

| Metric | Author-Reported (Upstream) | PhishShield Local Validation |
| :--- | :--- | :--- |
| **ROC-AUC** | 0.9868 | **0.7720** |
| **Accuracy** | 0.9486 | **0.7200** |
| **Precision** | 0.9476 | **0.6667** |
| **Recall** | 0.9496 | **0.8800** |
| **F1 Score** | 0.9486 | **0.7586** |
| **Default Threshold** | 0.50 | **0.50** |

---

## Explainability Policy

In the PhishShield XAI investigation pipeline:
1. **Single ML Indicator**: The ML model wrapper contributes exactly **one** explainable indicator containing the exact calibrated probability.
   - Example: `"pirocheto/phishing-url-detection scored this URL 0.9400 probability of phishing"`
2. **No Fabricated Sub-Features**: Per-feature explanations are not fabricated for the black-box vectorizer. Detailed semantic, structural, lexical, TLS, and domain anomalies are provided transparently by PhishShield's deterministic Rule Engine and Threat Intel feeds.

---

## Intended Use & Safety

- **Intended Use**: Real-time evaluation of incoming URLs in suspicious emails, web traffic, and user submissions.
- **Out of Scope**: Static evaluation of non-URL text files or binary executables directly (those pass through auxiliary enrichment pipelines).
- **Safety Policy**: Low risk classifications are strictly labeled `"Low Risk"` and **never** `"Safe"`. Every score is accompanied by at least one explainable indicator.

import os
import logging
import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from app.config import settings

logger = logging.getLogger("phishshield-ml")
logging.basicConfig(level=logging.INFO)

class PhishingModelWrapper:
    def __init__(self):
        self.session = None
        self.model_path = None
        self.input_name = "inputs"
        self.output_names = []
        self.version_str = f"{settings.HF_REPO_ID}:{settings.MODEL_FILE}@{settings.HF_REVISION[:8]}"

    def load_model(self):
        try:
            logger.info(f"Downloading model {settings.MODEL_FILE} from HF repo {settings.HF_REPO_ID} (rev: {settings.HF_REVISION})...")
            os.makedirs(settings.MODEL_CACHE_DIR, exist_ok=True)
            self.model_path = hf_hub_download(
                repo_id=settings.HF_REPO_ID,
                filename=settings.MODEL_FILE,
                revision=settings.HF_REVISION,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            logger.info(f"Model downloaded to {self.model_path}. Initializing ONNX InferenceSession...")

            # Use CPU Execution Provider
            opts = ort.SessionOptions()
            opts.intra_op_num_threads = 2
            opts.inter_op_num_threads = 2
            self.session = ort.InferenceSession(
                self.model_path,
                sess_options=opts,
                providers=["CPUExecutionProvider"]
            )

            inputs = self.session.get_inputs()
            self.input_name = inputs[0].name if inputs else "inputs"
            outputs = self.session.get_outputs()
            self.output_names = [o.name for o in outputs]

            logger.info(f"ONNX Model initialized. Input: '{self.input_name}', Outputs: {self.output_names}")
        except Exception as e:
            logger.error(f"Failed to load ONNX model: {e}", exc_info=True)
            raise e

    def predict(self, url: str, threshold: float = None) -> dict:
        if self.session is None:
            raise RuntimeError("Model session is not loaded")

        if threshold is None:
            threshold = settings.DEFAULT_THRESHOLD

        # Input raw string directly to the ONNX tensor
        # Pirocheto ONNX model expects 2D or 1D string array
        input_data = np.array([[url]], dtype=object)

        try:
            raw_outputs = self.session.run(None, {self.input_name: input_data})
        except Exception:
            # Fallback shape in case 1D array is expected
            input_data = np.array([url], dtype=object)
            raw_outputs = self.session.run(None, {self.input_name: input_data})

        # Parse outputs
        # Usually: raw_outputs[0] is labels, raw_outputs[1] is list of dicts or 2D array of probabilities
        phishing_prob = 0.50
        predicted_label = "LEGITIMATE"

        if len(raw_outputs) >= 2:
            probs = raw_outputs[1]
            if isinstance(probs, list) and len(probs) > 0 and isinstance(probs[0], dict):
                # Probabilities format: [{0: p_legit, 1: p_phish}] or [{'legitimate': p, 'phishing': p}]
                prob_dict = probs[0]
                if 1 in prob_dict:
                    phishing_prob = float(prob_dict[1])
                elif "1" in prob_dict:
                    phishing_prob = float(prob_dict["1"])
                elif "phishing" in prob_dict:
                    phishing_prob = float(prob_dict["phishing"])
                elif 0 in prob_dict:
                    phishing_prob = 1.0 - float(prob_dict[0])
            elif isinstance(probs, np.ndarray):
                if probs.ndim == 2 and probs.shape[1] >= 2:
                    phishing_prob = float(probs[0, 1])
                elif probs.ndim == 1 and len(probs) >= 2:
                    phishing_prob = float(probs[1])
                elif probs.size == 1:
                    phishing_prob = float(probs.item())
        elif len(raw_outputs) == 1:
            out = raw_outputs[0]
            if isinstance(out, np.ndarray):
                if out.dtype in [np.float32, np.float64]:
                    phishing_prob = float(out.item() if out.size == 1 else out[0, -1])

        # Clamp between 0.0 and 1.0
        phishing_prob = max(0.0, min(1.0, phishing_prob))

        predicted_label = "PHISHING" if phishing_prob >= threshold else "LEGITIMATE"

        return {
            "phishingProbability": round(phishing_prob, 4),
            "predictedLabel": predicted_label,
            "modelVersion": self.version_str,
            "modelType": "LinearSVM",
            "threshold": threshold
        }

model_wrapper = PhishingModelWrapper()

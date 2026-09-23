import os
import logging
from typing import Any, Dict, List, Optional

# Ensure transformers only uses PyTorch and does not attempt to import blocked TensorFlow DLLs
os.environ["USE_TF"] = "0"
os.environ["TRANSFORMERS_NO_TF"] = "1"
os.environ["USE_TORCH"] = "1"

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from app.config import settings

logger = logging.getLogger(__name__)


class MLDetector:
    """
    ML Detector using PromptShield DistilBERT V2.
    Loads tokenizer and weights once and runs fast inference with no gradients.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or settings.get_resolved_model_path()
        logger.info(f"Loading PromptShield DistilBERT V2 from: {self.model_path}")

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")

        is_local = os.path.exists(self.model_path)
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_path, local_files_only=is_local)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path, local_files_only=is_local)

        self.model.to(self.device)
        self.model.eval()
        self.is_loaded = True
        logger.info("PromptShield DistilBERT V2 successfully loaded in evaluation mode.")

    def predict(self, prompt: str) -> Dict[str, Any]:
        """
        Run inference on a single prompt.
        LABEL_0 = Benign
        LABEL_1 = Prompt Injection (Malicious)
        """
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=256,
            return_token_type_ids=False
        )

        # DistilBERT does not take token_type_ids
        inputs = {k: v.to(self.device) for k, v in inputs.items() if k != "token_type_ids"}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = torch.softmax(outputs.logits, dim=-1)[0]

        benign_prob = round(probabilities[0].item(), 4)
        malicious_prob = round(probabilities[1].item(), 4)
        predicted_class = int(torch.argmax(probabilities).item())

        prediction = "malicious" if predicted_class == 1 else "benign"
        confidence = round(probabilities[predicted_class].item(), 4)

        return {
            "prediction": prediction,
            "confidence": confidence,
            "benign_probability": benign_prob,
            "malicious_probability": malicious_prob
        }

    def predict_batch(self, prompts: List[str]) -> List[Dict[str, Any]]:
        """
        Run batch inference on multiple prompts simultaneously.
        """
        if not prompts:
            return []

        inputs = self.tokenizer(
            prompts,
            padding=True,
            truncation=True,
            max_length=256,
            return_tensors="pt",
            return_token_type_ids=False
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items() if k != "token_type_ids"}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs_tensor = torch.softmax(outputs.logits, dim=-1)

        results = []
        for i in range(len(prompts)):
            probs = probs_tensor[i]
            benign_prob = round(probs[0].item(), 4)
            malicious_prob = round(probs[1].item(), 4)
            predicted_class = int(torch.argmax(probs).item())
            prediction = "malicious" if predicted_class == 1 else "benign"
            confidence = round(probs[predicted_class].item(), 4)

            results.append({
                "prediction": prediction,
                "confidence": confidence,
                "benign_probability": benign_prob,
                "malicious_probability": malicious_prob
            })

        return results
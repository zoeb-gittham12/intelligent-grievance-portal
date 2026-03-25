from .config import AI_MODE
from .local_model import analyze_text
from .ml_model import predict

import logging
import os


# Setup logging
BASE_DIR = os.path.dirname(__file__)

logging.basicConfig(
    filename=os.path.join(BASE_DIR, "ai_logs.log"),
    level=logging.INFO,
    format="%(asctime)s - %(message)s"
)


def analyze_complaint_text(text):

    if AI_MODE == "local":
        result = analyze_text(text)

    elif AI_MODE == "ml":
        dept, priority = predict(text)

        result = {
            "department": dept,
            "priority": priority,
            "confidence": 0.92,
            "source": "ml"
        }

    else:
        return {"error": "Invalid AI mode"}

    # 🔥 Logging prediction details
    logging.info(
        f"Text: {text} | "
        f"Department: {result['department']} | "
        f"Priority: {result['priority']} | "
        f"Confidence: {result['confidence']} | "
        f"Source: {result['source']}"
    )

    return result
from textblob import TextBlob
import logging
logger = logging.getLogger(__name__)

# Department keyword mapping
DEPARTMENT_KEYWORDS = {
    "academics": ["exam", "marks", "result", "teacher", "class", "attendance"],
    "hostel": ["room", "mess", "warden", "water", "electricity"],
    "administration": ["fee", "id card", "certificate", "scholarship"]
}

# High risk words
HIGH_PRIORITY_WORDS = ["harassment", "ragging", "threat", "unsafe", "violence"]


def classify_department(text):
    text = text.lower()
    for dept, keywords in DEPARTMENT_KEYWORDS.items():
        for word in keywords:
            if word in text:
                return dept
    return "general"


def detect_priority(text):
    text_lower = text.lower()

    # Check for dangerous words first
    for word in HIGH_PRIORITY_WORDS:
        if word in text_lower:
            return "High"

    # Sentiment analysis
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity < -0.7:
        return "High"
    elif polarity < 0.2:
        return "Medium"
    else:
        return "Low"


def analyze_text(text):
    text_lower = text.lower()

    department = classify_department(text)
    priority = detect_priority(text)

    confidence = 0.5  # default

    # Increase confidence if keyword matched
    for dept, keywords in DEPARTMENT_KEYWORDS.items():
        for word in keywords:
            if word in text_lower:
                confidence = 0.85
                break

    # Increase confidence for dangerous words
    for word in HIGH_PRIORITY_WORDS:
        if word in text_lower:
            confidence = 0.95
            break
    logger.info(f"AI Prediction → Dept: {department}, Priority: {priority}, Confidence: {confidence}")

    return {
        "department": department,
        "priority": priority,
        "confidence": round(confidence, 2),
        "source": "local"
    }
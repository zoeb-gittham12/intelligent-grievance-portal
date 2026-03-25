import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Expanded training dataset
texts = [
    "Exam result not declared",
    "Attendance is not updated",
    "Teacher is not taking classes",
    "Mess food is very bad",
    "Room electricity problem",
    "Water supply issue in hostel",
    "Scholarship not received",
    "Fee payment issue",
    "ID card not generated",
    "Harassment in hostel",
    "Ragging by seniors",
    "Threat from classmates",
]

departments = [
    "academics",
    "academics",
    "academics",
    "hostel",
    "hostel",
    "hostel",
    "administration",
    "administration",
    "administration",
    "hostel",
    "hostel",
    "academics",
]

priorities = [
    "Medium",
    "Medium",
    "Medium",
    "Medium",
    "Low",
    "Low",
    "Medium",
    "Medium",
    "Low",
    "High",
    "High",
    "High",
]

# Create Department Model
department_model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

department_model.fit(texts, departments)

# Create Priority Model
priority_model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

priority_model.fit(texts, priorities)

# Save models inside ai_engine folder
BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "department_model.pkl"), "wb") as f:
    pickle.dump(department_model, f)

with open(os.path.join(BASE_DIR, "priority_model.pkl"), "wb") as f:
    pickle.dump(priority_model, f)

print("Department and Priority models trained successfully!")
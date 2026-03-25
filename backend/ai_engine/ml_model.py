import pickle
import os

BASE_DIR = os.path.dirname(__file__)

with open(os.path.join(BASE_DIR, "department_model.pkl"), "rb") as f:
    department_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "priority_model.pkl"), "rb") as f:
    priority_model = pickle.load(f)


def predict(text):
    dept = department_model.predict([text])[0]
    priority = priority_model.predict([text])[0]

    return dept, priority
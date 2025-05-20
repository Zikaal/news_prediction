#!/usr/bin/env python3
import sys
import json
import joblib

def main():
    model = joblib.load("news_ensemble_model.pkl")

    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)
    text = sys.argv[1]

    proba = model.predict_proba([text])[0]
    classes = model.classes_.tolist()
    probabilities = [round(p * 100, 2) for p in proba]
    prediction = classes[probabilities.index(max(probabilities))]

    print(json.dumps({
        "classes": classes,
        "probabilities": probabilities,
        "prediction": prediction
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()

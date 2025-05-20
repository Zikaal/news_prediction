#!/usr/bin/env python3
import sys
import json
import joblib

def main():
    # Загрузка модели
    model = joblib.load("news_ensemble_model.pkl")

    # Получаем вход из аргумента
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)
    text = sys.argv[1]

    # Предсказание
    proba = model.predict_proba([text])[0]
    classes = model.classes_.tolist()
    probabilities = [round(p * 100, 2) for p in proba]
    prediction = classes[probabilities.index(max(probabilities))]

    # Выводим JSON
    result = {
        "classes": classes,
        "probabilities": probabilities,
        "prediction": prediction
    }
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()

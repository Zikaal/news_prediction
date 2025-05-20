#!/usr/bin/env python3
import sys, json, joblib

def main():
    # загружаем модель
    model = joblib.load("news_ensemble_model.pkl")

    # получаем текст из аргумента
    text = sys.argv[1] if len(sys.argv) > 1 else ""

    # делаем предсказание вероятностей
    proba = model.predict_proba([text])[0]
    labels = model.classes_.tolist()

    result = {
        "classes":       labels,
        "probabilities": [round(p * 100, 2) for p in proba],
        "prediction":    labels[proba.argmax()]
    }

    # выводим ровно JSON
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()

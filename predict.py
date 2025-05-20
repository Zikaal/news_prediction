#!/usr/bin/env python3
import sys, json, joblib

def main():
    # Загружаем вашу модель (должен быть файл news_ensemble_model.pkl в корне)
    model = joblib.load("news_ensemble_model.pkl")

    # Берём текст из аргумента
    text = sys.argv[1] if len(sys.argv) > 1 else ""

    # Предсказываем вероятности
    proba = model.predict_proba([text])[0]
    labels = model.classes_.tolist()

    # Собираем результат
    result = {
        "classes":       labels,
        "probabilities": [round(p * 100, 2) for p in proba],
        "prediction":    labels[proba.argmax()]
    }

    # Выводим чистый JSON
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()

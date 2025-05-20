#!/usr/bin/env python3
import sys
import json
import joblib

def main():
    # Загружаем модель (предполагается, что это Pipeline с Vectorizer + классификатором)
    model = joblib.load("news_ensemble_model.pkl")

    # Получаем текст из аргументов
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input text provided"}))
        sys.exit(1)
    text = sys.argv[1]

    # Делаем предсказание вероятностей
    proba = model.predict_proba([text])[0]  # массив вида [p0, p1, ..., pN]
    classes = model.classes_               # массив меток классов

    # Собираем результат
    result = {
        "classes": classes.tolist(),
        "probabilities": [round(float(p) * 100, 2) for p in proba],  # в процентах, округлено до сотых
        "prediction": classes[proba.argmax()]                       # класс с максимальной вероятностью
    }

    # Печатаем JSON в stdout
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()

from flask import Flask, render_template, request
import joblib
import json
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

app = Flask(__name__)
model = joblib.load("news_ensemble_model.pkl")

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    classes = []
    probabilities = []
    text_input = ""
    if request.method == "POST":
        text_input = request.form.get("news_text", "")
        # Получаем массив вероятностей
        proba = model.predict_proba([text_input])[0]
        # Список классов в том же порядке, что и proba
        classes = model.classes_.tolist()
        # Переводим в проценты и округляем
        probabilities = [round(p * 100, 2) for p in proba]
        # Выбираем класс с максимальной вероятностью
        idx_max = probabilities.index(max(probabilities))
        prediction = classes[idx_max]
    return render_template(
        "index.html",
        prediction=prediction,
        text_input=text_input,
        classes=json.dumps(classes),
        probabilities=json.dumps(probabilities),
    )

if __name__ == "__main__":
    app.run(debug=True)

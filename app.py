from flask import Flask, jsonify, request, render_template
import numpy as np
import pandas as pd
from sklearn import metrics
import warnings
import pickle
from convert import convertion
warnings.filterwarnings('ignore')
from feature import FeatureExtraction

file = open("gbc.pkl","rb")
gbc = pickle.load(file)
file.close()

app = Flask(__name__)
@app.route("/")
def home():
    phishing_url = request.args.get("phishing_url") 
    return render_template("index.html", phishing_url=phishing_url)

@app.route('/result', methods=['POST', 'GET'])
def predict():
    if request.method == "POST":
        url = request.form["name"]
        print("URL:", url)  
        obj = FeatureExtraction(url)
        x = np.array(obj.getFeaturesList()).reshape(1, 30)
        print("Extracted Features:", x) 
        y_pred = gbc.predict(x)[0]
        y_proba = gbc.predict_proba(x)
        print("Prediction:", y_pred) 
        print("Probabilities (Safe, Malicious):", y_proba) 

        y_pro_phishing = y_proba[0, 0]
        y_pro_non_phishing = y_proba[0, 1]

        threshold = 0.5  
        if y_pro_non_phishing > threshold:
            y_pred = 1  # Safe
        else:
            y_pred = -1  # Malicious

        if y_pred == 1:
            pred = "It is {0:.2f} % safe to go ".format(y_pro_phishing * 100)
            xx = y_pro_non_phishing
            name = convertion(url, int(y_pred))
        else:
            xx = y_pro_phishing
            name = convertion(url, int(y_pred))
        return render_template("index.html", name=name, xx=xx)
    
@app.route('/check_url', methods=['POST'])
def check_url():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    obj = FeatureExtraction(url)
    x = np.array(obj.getFeaturesList()).reshape(1, 30)
    y_pred = gbc.predict(x)[0]

    return jsonify({"phishing": bool(y_pred == -1)})

if __name__ == "__main__":
    app.run(debug=True)

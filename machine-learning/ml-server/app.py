import os
import numpy as np
from flask import Flask, flash, request, redirect, url_for, send_from_directory, Response
from werkzeug.utils import secure_filename
from flask_cors import CORS
# import keras

UPLOAD_FOLDER = './scans_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
app.secret_key = "key"

# Load your trained Keras model
# model = keras.saving.load_model('cnn_finetuned.keras')
classes = ['gilmoa', 'meningioma', 'non_tumorous', 'pituitary']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def hello_world():
    return "Hello World!"

@app.route("/scan_analysis", methods=['GET', 'POST'])
def scan_analysis():

    scan_report = {
        "status": False,
        "inference_error": False,
        "results": {
            "confidence_glioma": -1.00,
            "confidence_meningioma": -1.00,
            "confidence_non_tumorous": -1.00,
            "confidence_pituitary": -1.00
        },
        "condition_prediction": "N/A"
    }

    if request.method == 'POST':

        if 'file' not in request.files:
            return scan_report, 400

        file = request.files['file']

        if file.filename == '' or not allowed_file(file.filename):
            return scan_report, 400

        if file:

            try:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                # image = keras.utils.load_img(
                #     file_path,
                #     target_size=(299, 299),
                #     )
                # input_arr = keras.utils.img_to_array(image)
                # input_arr = np.array([input_arr])

                # predictions = model.predict(input_arr)
                # predicted_class = np.argmax(predictions, axis=1)[0]

                # scan_report['results']['confidence_glioma'] = str(predictions[0][0])
                # scan_report['results']['confidence_meningioma'] = str(predictions[0][1])
                # scan_report['results']['confidence_non_tumorous'] = str(predictions[0][2])
                # scan_report['results']['confidence_pituitary'] = str(predictions[0][3])
                # scan_report['condition_prediction'] = classes[predicted_class]

            except Exception as e:
                print(f"Error during model inference: {e}")
                scan_report['inference_error'] = True
                return scan_report, 500

            scan_report['error'] = 'false'
            return scan_report, 200

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)

if __name__ == '__main__':
    app.run(debug=True)
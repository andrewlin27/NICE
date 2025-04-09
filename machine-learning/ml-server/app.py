import os
from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

UPLOAD_FOLDER = './scans_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# REAL, DUMMY
INFERENCE_MODE = os.environ.get('FLASK_INFERENCE_MODE', 'REAL')

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

app.config['INFERENCE_MODE'] = INFERENCE_MODE

app.secret_key = "key"

# Load Keras model if local is selected
if app.config['INFERENCE_MODE'] == 'REAL':
    import keras
    import numpy as np
    model = keras.saving.load_model('./models/cnn_finetuned.keras')
    classes = ['Glioma', 'Meningioma', 'Non-tumorous', 'Pituitary Tumor']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/scan_analysis", methods=['GET', 'POST'])
def scan_analysis():

    # Default scan report response
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

        # Check for, and grab, file in request
        if 'file' not in request.files:
            return scan_report, 400
        file = request.files['file']

        # Reject files with no name or incorrect file format
        if file.filename == '' or not allowed_file(file.filename):
            return scan_report, 400

        # If app is in real inference mode, run inference and 
        if file and app.config['INFERENCE_MODE'] == 'REAL':
            try:
                # Save file to be loaded into ML model
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                # Load and format image to model's requirements (299x299 for Xception)
                image = keras.utils.load_img(
                    file_path,
                    target_size=(299, 299),
                    )
                # Format input image as a batch
                input_arr = keras.utils.img_to_array(image)
                input_arr = np.array([input_arr])

                # Run model inference and find the most confident class
                predictions = model.predict(input_arr)
                predicted_class = np.argmax(predictions, axis=1)[0]

                # Load results into json response
                scan_report['results']['confidence_glioma'] = str(round(predictions[0][0] * 100, 2)) + "%"
                scan_report['results']['confidence_meningioma'] = str(round(predictions[0][1] * 100, 2)) +"%"
                scan_report['results']['confidence_non_tumorous'] = str(round(predictions[0][2] * 100, 2)) + "%"
                scan_report['results']['confidence_pituitary'] = str(round(predictions[0][3] * 100, 2)) + "%"
                scan_report['condition_prediction'] = classes[predicted_class]

            except Exception as e:
                print(f"Error during model inference: {e}")
                scan_report['inference_error'] = True
                return scan_report, 500

        # Return model results if no errors encountered
        scan_report['error'] = 'false'
        return scan_report, 200

    # GET -> HTML form to upload an image
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.run(debug=True)

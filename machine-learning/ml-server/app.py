import base64
import os
from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

IMAGES_FOLDER = './images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# REAL, DUMMY
INFERENCE_MODE = os.environ.get('FLASK_INFERENCE_MODE', 'REAL')

app = Flask(__name__)
CORS(app)

app.config['IMAGES_FOLDER'] = IMAGES_FOLDER
if not os.path.exists(app.config['IMAGES_FOLDER']):
    os.makedirs(app.config['IMAGES_FOLDER'])

app.config['INFERENCE_MODE'] = INFERENCE_MODE

app.secret_key = "key"

# Load Keras model if local is selected
if app.config['INFERENCE_MODE'] == 'REAL':
    import cv2
    import numpy as np
    import matplotlib.pyplot as plt

    import keras
    model = keras.saving.load_model('./cnn_finetuned.keras')

    from ultralytics import YOLO
    seg_model = YOLO("seg.onnx")

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
        "condition_prediction": "N/A",
        "image": "",
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
                file_path = os.path.join(app.config['IMAGES_FOLDER'], filename)
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

                """
                Segmentation Route: Segment image if tumorous class detected
                """
                if predicted_class != 2:
                    pre_image = cv2.imread(file_path)
                    pre_image = cv2.resize(pre_image, (640, 640), interpolation=cv2.INTER_LINEAR)
                    pre_image = cv2.cvtColor(pre_image, cv2.COLOR_BGR2RGB)
                    results = seg_model(pre_image)
                    segmented_image = results[0].plot()

                    # Convert PIL to NumPy (RGB) then to BGR for OpenCV
                    segmented_image_np = np.array(segmented_image)
                    segmented_image_bgr = cv2.cvtColor(segmented_image_np, cv2.COLOR_RGB2BGR)

                    # Save the image
                    cv2.imwrite(os.path.join(app.config["IMAGES_FOLDER"], filename), segmented_image_bgr)

            except Exception as e:
                print(f"Error during model inference: {e}")
                scan_report['inference_error'] = True
                return scan_report, 500

        # Encode server image (Any alterations, i.e. resizing, bounding box)
        with open(os.path.join(app.config["IMAGES_FOLDER"], filename), "rb") as img_file:
            b64_data = base64.b64encode(img_file.read()).decode("utf-8")
            scan_report['image'] = f"data:image/jpeg;base64,{b64_data}"

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

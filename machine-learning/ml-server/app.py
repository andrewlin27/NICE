import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, Response
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './scans_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
app.secret_key = "key"

@app.route("/")
def hello_world():
    return "Hello World!"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/scan_analysis", methods=['GET', 'POST'])
def scan_analysis():

    scan_report = {
                # Did model run successfully? bool
                "status": False,
                # Model Results, confidence score on if disease is detected
                "results" : {
                    # "confidence_stroke"
                    # "confidence_tumors"
                    "confidence": -1.00

                    # Segmented image
                    # "segmented_image" : []pixels
                    }
                }

    if request.method == 'POST':

        # check if the post request has the file part
        if 'file' not in request.files:
            return scan_report, 400

        file = request.files['file']

        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return scan_report, 400

        if not allowed_file(file.filename):
            return scan_report, 400

        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            ### Run inference over the image
            ## transform_image(image)
            ## model.predict(image)
            ## Was inference successful?
            scan_report['status'] = True
            scan_report['results']['confidence'] = 1.00

            ## return results
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
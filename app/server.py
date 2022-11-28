'''
mnister (keras save_model) by YoshimasaIwano, Kaiyu0128
'''
import argparse
import tensorflow
import base64
import json
import numpy as np
from flask import Flask, request, render_template, jsonify
from flask_ngrok import run_with_ngrok
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from io import BytesIO
from PIL import Image
from waitress import serve


app = Flask(__name__)

# validation
def validation():
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--colab',
                        action="store_true",
                        help='Specify when running on Google Colab.(use flask-ngrok)')
    args = parser.parse_args()
    return args

#  check argument
args = validation()
if args.colab:    
    print("use flask-ngrok.")
    run_with_ngrok(app)




# labels
label = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
class_names = ['a', 'e', 'ha', 'he', 'hi', 'ho', 'hu', 'i', 'ka', 'ke', 'ki', 'ko', 'ku', 'ma', 'me', 'mi', 'mo', 'mu', 'na', 'ne', 'ni', 'nn', 'no', 'nu', 'o', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su', 'ta', 'te', 'ti', 'to', 'tu', 'u', 'wa', 'wo', 'ya', 'yo', 'yu']

# loading model and summary
model = load_model('colab_mnist.hdf5')
model.summary()

# Input Size classification
_, img_w, img_h, img_ch = model.layers[0].input.shape
print("img_w:{} img_h:{} img_ch:{}".format(img_w, img_h, img_ch))

# index.html
@app.route("/")
def index():
    return render_template('index.html')



# Activate when hiragana is posted from input.js
@app.route('/output', methods=['POST'])
def output():
    # Receiving hiragana input as json type
    b64_pngdata = request.json['b64_pngdata']

    # base64 decode
    tmpdata = b64_pngdata.split(',')  
    bindata = base64.b64decode(tmpdata[1])  

    # Resizing input image size
    img_PIL = Image.open(BytesIO(bindata)).convert('RGB')
    if img_ch == 1:
        img_PIL = img_PIL.convert('L')     
    img_PIL = img_PIL.resize((img_w, img_h))    

    # pillow→binary
    with BytesIO() as output_png:
        img_PIL.save(output_png, format="PNG")
        contents = output_png.getvalue()  

    # mnist type convert
    x = img_to_array(img_PIL) / 255
    x = x[None, ...]

    # prediction
    pred = model.predict(x)
    np.set_printoptions(suppress=True, precision=10, floatmode='fixed')
    print(pred)

    # predicted label
    pred_label = label[int(np.argmax(pred[0]))]
    print("label:", pred_label)

    # predicted score
    score = str("{:.10f}".format(np.max(pred)))
    print("score:", score)
    print("------------------------------------------------------------------")

    # base64 encode
    tmp_data = str(base64.b64encode(contents))
    tmp_data = tmp_data[2:-1]  

    data1 = "data:image/png;base64," + tmp_data
    data2 = pred_label
    data3 = score
    label_score = [str("{:.10f}".format(n)) for n in pred[0]]

    return_data = {"pred_png": data1,
                   "pred_label": data2,
                   "pred_score": data3,
                   "label0": label_score[0],
                   "label1": label_score[1],
                   "label2": label_score[2],
                   "label3": label_score[3],
                   "label4": label_score[4],
                   "label5": label_score[5],
                   "label6": label_score[6],
                   "label7": label_score[7],
                   "label8": label_score[8],
                   "label9": label_score[9]
                   }

    return jsonify(ResultSet=json.dumps(return_data))

# For debug
def display(data, name):
    print(name)
    print(data)
    print(type(data))
    print("")

# Activate flask
if __name__ == '__main__':
    app.debug = False
    # app.run()
    serve(app, host='0.0.0.0', port=5000)

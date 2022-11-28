'''
Hiragana Classifier by YoshimasaIwano, Kaiyu0128
'''
# import argparse
import tensorflow as tf
import base64
import json
import numpy as np
from flask import Flask, request, render_template, jsonify
# from flask_ngrok import run_with_ngrok
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from io import BytesIO
from PIL import Image
from waitress import serve

from model import EfficientHiragana

app = Flask(__name__)

# labels
class_names = ['a', 'e', 'ha', 'he', 'hi', 'ho', 'hu', 'i', 'ka', 'ke', 'ki', 'ko', 'ku', 'ma', 'me', 'mi', 'mo', 'mu', 'na', 'ne', 'ni', 'nn', 'no', 'nu', 'o', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su', 'ta', 'te', 'ti', 'to', 'tu', 'u', 'wa', 'wo', 'ya', 'yo', 'yu']

# loading model and summary
IMG_SIZE = 48
input_shape = IMG_SIZE 
output_shape = 46
model = EfficientHiragana(input_shape, output_shape)
optimizer = tf.keras.optimizers.Adam()
model.build(input_shape=(None, IMG_SIZE, IMG_SIZE, 3))
model.compile(
    optimizer=optimizer,
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
model.load_weights('EfficientNetB0_Hiragana.h5')
model.summary()

# Input Size classification
img_w, img_h, img_ch = IMG_SIZE, IMG_SIZE, 3
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
    tmp_img = Image.open(BytesIO(bindata)).convert('RGB')
    if img_ch == 1:
        tmp_img = tmp_img.convert('L')     
    tmp_img = tmp_img.resize((img_w, img_h))    

    # pillow→binary
    with BytesIO() as output_png:
        tmp_img.save(output_png, format="PNG")
        contents = output_png.getvalue()  

    # mnist type convert
    x = img_to_array(tmp_img) 
    x = x[None, ...]

    # prediction
    pred = model.predict(x)
    np.set_printoptions(suppress=True, precision=10, floatmode='fixed')
    print(pred)

    # predicted label
    pred_label = class_names[int(np.argmax(pred[0]))]
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
    # label_score = [str("{:.10f}".format(n)) for n in pred[0]]

    return_data = {"pred_png": data1,
                   "pred_label": data2,
                   "pred_score": data3,
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

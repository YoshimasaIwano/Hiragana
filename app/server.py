'''
    The main backend (flask) python file.

    Author: YoshimasaIwano and KaiyuYokoi
'''
import tensorflow as tf
import base64
import json
import numpy as np
from flask import Flask, request, render_template, jsonify
# from flask_ngrok import run_with_ngrok
# from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from io import BytesIO
from PIL import Image
from waitress import serve
import os

from model import EfficientHiragana

app = Flask(__name__)

# labels
class_names = ['あ(a)', 'え(e)', 'は(ha)', 'へ(he)', 'ひ(hi)', 'ほ(ho)', 'ふ(fu)', 'い(i)', 'か(ka)', 'け(ke)', 'き(ki)', 'こ(ko)', 'く(ku)', 'ま(ma)', 'め(me)', 'み(mi)', 'も(mo)', 'む(mu)', 'な(na)', 'ね(ne)', 'に(ni)', 'ん(n)', 'の(no)', 'ぬ(nu)', 'お(o)', 'ら(ra)', 'れ(re)', 'り(ri)', 'ろ(ro)', 'る(ru)', 'さ(sa)', 'せ(se)', 'し(shi)', 'そ(so)', 'す(su)', 'た(ta)', 'て(te)', 'ち(chi)', 'と(to)', 'つ(tsu)', 'う(u)', 'わ(wa)', 'を(wo)', 'や(ya)', 'よ(yo)', 'ゆ(yu)']

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

    # image type convert
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

    img_data = "data:image/png;base64," + tmp_data

    return_data = {"pred_png": img_data,
                   "pred_label": pred_label,
                   "pred_score": score,
                   }

    return jsonify(ResultSet=json.dumps(return_data))

# Activate flask
if __name__ == '__main__':
    app.debug = False
    PORT = os.environ.get('PORT', '5000')
    # app.run()
    serve(app, host='0.0.0.0', port=PORT)

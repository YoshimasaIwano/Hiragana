from flask import Flask, render_template, request
from tensorflow.keras.models import load_model
from PIL import Image
from tensorflow.keras.preprocessing.image import img_to_array 
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.files['input_file'].stream
    im = Image.open(data)
    
    # model = load_model('keras_cnn_model_gray_weight.h5') #グレースケール（白黒）の場合のモデル読み込み
    # model = load_model('keras_cnn_model_color_weight.h5') #カラーの場合のモデル読み込み
    model = load_model('mnist/keras_mnist_model.h5')

    # folder = ['○：丸', '×：バツ']  
    folder = ['0','1','2','3','4','5','6','7','8','9']
    image_size = 28
    color_setting = 1 #グレースケール（白黒）の場合は「1」にする
    # color_setting = 3 #カラーの場合の場合は「3」にする

    img = im.resize((image_size, image_size))
    img = img.convert(mode='L') #グレースケール（白黒）の場合は「L」
    #img = img.convert(mode='RGB') #カラーの場合は「RGB」

    img = img_to_array(img)
    img = img.reshape(image_size, image_size, color_setting).astype('float32')/255

    result = model.predict(np.array([img]))
    result = result[0]
    
    return render_template('result.html',result_output=folder[result.argmax()])

if __name__ == '__main__':
    app.run(debug=True)
    
    
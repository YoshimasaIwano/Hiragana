############################################################
# mnister (keras save_model) by YoshimasaIwano, Kaiyu0128
############################################################
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


############################################################
# Flask
############################################################
app = Flask(__name__)


############################################################
# validation
############################################################
def validation():
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--colab',
                        action="store_true",
                        help='Specify when running on Google Colab.(use flask-ngrok)')
    args = parser.parse_args()
    return args


############################################################
# 引数チェック
############################################################
args = validation()
if args.colab:                              # use Google Colab
    print("use flask-ngrok.")
    run_with_ngrok(app)


############################################################
# 初期設定
############################################################
# 【注意】
# keras or tensorflow のバージョンをupgradeしてバージョンUPしておくこと
# keras : 2.3.1
# tensorflow : 2.3.0
# pip install --upgrade pip --user
# pip install --upgrade tensorflow --user
# pip install --upgrade keras --user

# print("keras : ", keras.__version__)
# print("tensorflow : ", tensorflow.__version__)

# ラベル
label = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

# modelの読込と表示
model = load_model('colab_mnist.hdf5')
model.summary()

# Input Sizeの自動判別
_, img_w, img_h, img_ch = model.layers[0].input.shape
print("img_w:{} img_h:{} img_ch:{}".format(img_w, img_h, img_ch))

############################################################
# index.html
############################################################
@app.route("/")
def index():
    return render_template('index.html')


############################################################
# Input.jsからPOSTされたときに動作
############################################################
@app.route('/output', methods=['POST'])
def output():
    # json形式でデータを受け取る
    b64_pngdata = request.json['b64_pngdata']
#   display(b64_pngdata, "b64_pngdata")

    # base64デコード
    tmpdata = b64_pngdata.split(',')  # base64のヘッダを削除
    bindata = base64.b64decode(tmpdata[1])  # 「data:image/png;base64,～」以降のデータのみをデコード
#   display(bindata, "bindata")

    # pillow形式で読み込み画像のリサイズを行う
    imgPIL = Image.open(BytesIO(bindata)).convert('RGB')
    if img_ch == 1:
        imgPIL = imgPIL.convert('L')            # グレースケール
    imgPIL = imgPIL.resize((img_w, img_h))      # リサイズ
#   imgPIL.show()

    # pillow形式→バイナリ変換
    with BytesIO() as output_png:
        imgPIL.save(output_png, format="PNG")
        contents = output_png.getvalue()  # バイナリ取得

    # mnist形式
    x = img_to_array(imgPIL) / 255
    x = x[None, ...]

    # shape確認
#   print(x.shape)
    print("")

    # 遊星からの物体Xの推測
    pred = model.predict(x)
    np.set_printoptions(suppress=True, precision=10, floatmode='fixed')
    print(pred)
#   print(type(pred))
    print("")

    # 推測ラベル
    pred_label = label[int(np.argmax(pred[0]))]
    print("label:", pred_label)

    # 推測スコア
    score = str("{:.10f}".format(np.max(pred)))
    print("score:", score)
    print("------------------------------------------------------------------")

    # base64エンコード
    tmpdata = str(base64.b64encode(contents))
    #   display(tmpdata, "tmpdata")
    tmpdata = tmpdata[2:-1]  # 「ｂ’～’」の中身だけをエンコード

    data1 = "data:image/png;base64," + tmpdata
    data2 = pred_label
    data3 = score
    label_score = [str("{:.10f}".format(n)) for n in pred[0]]
#   print(label_name)

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


############################################################
# debug用
############################################################
def display(data, name):
    print(name)
    print(data)
    print(type(data))
    print("")


############################################################
# flask起動
############################################################
if __name__ == '__main__':
    app.debug = False
    app.run()

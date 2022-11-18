// use Createjs and JQuery
window.addEventListener("load", init);
function init() {

    // --------------------------------------------------------------
    // Stage1オブジェクト：WriteCanvas
    // --------------------------------------------------------------
    var stage1 = new createjs.Stage("WriteCanvas");

    // タッチイベントが有効なブラウザの場合、
    // CreateJSでタッチイベントを扱えるようにする
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage1);
    }

    var shape = new createjs.Shape();   // シェイプを作成
    stage1.addChild(shape);             // ステージに配置

    handleClick_reset();

    // ステージ上でマウスボタンを押した時のイベント設定
    stage1.addEventListener("stagemousedown", handleDown);

    // マウスを押した時に実行される
    function handleDown(event) {

        var paintColor = "#FFFFFF"                      // 筆ペンの色

        // 線の描画を開始
        shape.graphics
                .beginStroke(paintColor)                // 指定のカラーで描画
                .setStrokeStyle(20, "round")            // 線の太さ、形
                .moveTo(event.stageX, event.stageY);    // 描画開始位置を指定

        // ステージ上でマウスを動かした時と離した時のイベント設定
        stage1.addEventListener("stagemousemove", handleMove);
        stage1.addEventListener("stagemouseup", handleUp);
    }

    // マウスが動いた時に実行する
    function handleMove(event) {

        // マウス座標への線を引く
        shape.graphics.lineTo(event.stageX, event.stageY);
    }

    // マウスボタンが離された時に実行される
    function handleUp(event) {

        // マウス座標への線を引く
        shape.graphics.lineTo(event.stageX, event.stageY);

        // 線の描画を終了する
        shape.graphics.endStroke();

        // イベント解除
        stage1.removeEventListener("stagemousemove", handleMove);
        stage1.removeEventListener("stagemouseup", handleUp);
    }

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);

    function onTick() {
        stage1.update(); // Stageの描画を更新
    }

    // --------------------------------------------------------------
    // Stage2オブジェクト：ButtonCanvas
    // --------------------------------------------------------------
    var stage2 = new createjs.Stage("ButtonCanvas");
    stage2.enableMouseOver();

    // ボタンを作成
    var btn1 = createButton("Predict", 80, 30, "#0650c7");
    btn1.x = 20;
    btn1.y = 10;
    stage2.addChild(btn1);

    var btn2 = createButton("Reset", 80, 30, "#ff6161");
    btn2.x = 110;
    btn2.y = 10;
    stage2.addChild(btn2);

    // イベントを登録
    btn1.addEventListener("click", handleClick_png);
    btn2.addEventListener("click", handleClick_reset);

    // Predictボタン押下イベント
    function handleClick_png(event) {

        // Canvasタグから画像に変換
        stage1.update();
        var png = stage1.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;

        // JQueryによるPOST処理
        // javascript→pythonへPNGデータ転送
        var textData = JSON.stringify({"b64_pngdata":png});
//      console.log(textData);
        $.ajax({
            type:'POST',
            url:'/output',
            data:textData,
            contentType:'application/json',

            // python→javascriptへデータ返送
            // 非同期通信が成功したら実行される
            success:function(data){
                // 返却jsonデータからparseしてデータ取り出し
//              console.log(data);
                var result = JSON.parse(data.ResultSet);
                document.getElementById("ResultImg").src = result.pred_png;
                document.getElementById("ResultLabel").textContent = result.pred_label;
                document.getElementById("ResultScore").textContent = result.pred_score;
                document.getElementById("Label0").textContent = result.label0;
                document.getElementById("Label1").textContent = result.label1;
                document.getElementById("Label2").textContent = result.label2;
                document.getElementById("Label3").textContent = result.label3;
                document.getElementById("Label4").textContent = result.label4;
                document.getElementById("Label5").textContent = result.label5;
                document.getElementById("Label6").textContent = result.label6;
                document.getElementById("Label7").textContent = result.label7;
                document.getElementById("Label8").textContent = result.label8;
                document.getElementById("Label9").textContent = result.label9;
            }
        });
    }

    // Restボタン押下イベント
    function handleClick_reset(event) {

        // シェイプのグラフィックスを消去
        shape.graphics.clear();
        shape.graphics.beginFill("black");
        shape.graphics.drawRect(0, 0, 240, 240);
        shape.graphics.endFill();
        stage1.update();
        var png = stage1.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;
    }

    // 時間経過イベント
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {

        // Stage2の描画を更新
        stage2.update();
    }

    /**
    * @param {String} text ボタンのラベル文言です。
    * @param {Number} width ボタンの横幅(単位はpx)です。
    * @param {Number} height ボタンの高さ(単位はpx)です。
    * @param {String} keyColor ボタンのキーカラーです。
    * @returns {createjs.Container} ボタンの参照を返します。
    */
    function createButton(text, width, height, keyColor) {

        // ボタン要素をグループ化
        var button = new createjs.Container();
        button.name = text; // ボタンに参考までに名称を入れておく(必須ではない)
        button.cursor = "pointer"; // ホバー時にカーソルを変更する

        // 通常時の座布団を作成
        var bgUp = new createjs.Shape();
        bgUp.graphics
              .setStrokeStyle(1.0)
              .beginStroke(keyColor)
              .beginFill("white")
              .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
        button.addChild(bgUp);
        bgUp.visible = true; // 表示する

        // ロールオーバー時の座布団を作成
        var bgOver = new createjs.Shape();
        bgOver.graphics
              .beginFill(keyColor)
              .drawRoundRect(0, 0, width, height, 4);
        bgOver.visible = false; // 非表示にする
        button.addChild(bgOver);

        // ラベルを作成
        var label = new createjs.Text(text, "18px sans-serif", keyColor);
        label.x = width / 2;
        label.y = height / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        button.addChild(label);

        // ロールオーバーイベントを登録
        button.addEventListener("mouseover", handleMouseOver);
        button.addEventListener("mouseout", handleMouseOut);

        // マウスオーバイベント
        function handleMouseOver(event) {
            bgUp.visble = false;
            bgOver.visible = true;
            label.color = "white";
        }

        // マウスアウトイベント
        function handleMouseOut(event) {
            bgUp.visble = true;
            bgOver.visible = false;
            label.color = keyColor;
        }

        return button;
    }
}
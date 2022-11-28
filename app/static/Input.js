// // use Createjs and JQuery
// window.addEventListener("load", init);
// function init() {
//     // canvas object
//     let drawCanvas = new createjs.Stage("WriteCanvas");

//     // enable touch Event if possible
//     if (createjs.Touch.isSupported()) {
//         createjs.Touch.enable(drawCanvas);
//     }

//     let shape = new createjs.Shape();
//     drawCanvas.addChild(shape);             
//     resetEvent();

//     // set mousedown event listener
//     drawCanvas.addEventListener("stagemousedown", handleDown);

//     // when mouse is down
//     function handleDown(event) {
//         //  black: "#000000", white: "#FFFFFF"
//         let paintColor = "#000000"

//         // start to draw
//         shape.graphics
//             .beginStroke(paintColor)
//             .setStrokeStyle(20, "round") 
//             .moveTo(event.stageX, event.stageY);

//         // add events mouse move and up
//         drawCanvas.addEventListener("stagemousemove", handleMove);
//         drawCanvas.addEventListener("stagemouseup", handleUp);
//     }

//     // mouse move events
//     function handleMove(event) {
//         shape.graphics.lineTo(event.stageX, event.stageY);
//     }

//     // mouse up events
//     function handleUp(event) {
//         shape.graphics.lineTo(event.stageX, event.stageY);
//         shape.graphics.endStroke();

//         // release the move and up events
//         drawCanvas.removeEventListener("stagemousemove", handleMove);
//         drawCanvas.removeEventListener("stagemouseup", handleUp);
//     }

//     // To update image
//     createjs.Ticker.timingMode = createjs.Ticker.RAF;
//     createjs.Ticker.addEventListener("tick", onTick);

//     function onTick() {
//         drawCanvas.update();
//     }


//     // Buttuon Object
//     let buttons = new createjs.Stage("ButtonCanvas");
//     buttons.enableMouseOver();

//     // create predict button
//     let pred_button = createButton("Predict", 80, 30, "#0650c7");
//     pred_button.x = 20;
//     pred_button.y = 10;
//     buttons.addChild(pred_button);

//     let reset_button = createButton("Reset", 80, 30, "#ff6161");
//     reset_button.x = 110;
//     reset_button.y = 10;
//     buttons.addChild(reset_button);

//     // add click events
//     pred_button.addEventListener("click", predictEvent);
//     reset_button.addEventListener("click", resetEvent);

//     // predict button event 
//     function predictEvent(event) {

//         // trasform canvas to image
//         drawCanvas.update();
//         let png = drawCanvas.canvas.toDataURL();
//         // document.getElementById("ChgPngImg").src = png;

//         // JQuery
//         // send data from javascript to python
//         let textData = JSON.stringify({"b64_pngdata":png});
//         $.ajax({
//             type:'POST',
//             url:'/output',
//             data:textData,
//             contentType:'application/json',

//             success:function(json_data){
//                 console.log(json_data);
//                 let ret = JSON.parse(json_data.results);
//                 document.getElementById("ResultImg").src = ret.pred_png;
//                 document.getElementById("ResultLabel").textContent = ret.pred_label;
//                 document.getElementById("ResultScore").textContent = ret.pred_score;
//             }
//         });
//     }

//     // reset button event
//     function resetEvent(event) {
//         shape.graphics.clear();
//         shape.graphics.beginFill("white"); 
//         shape.graphics.drawRect(0, 0, 240, 240);
//         shape.graphics.endFill();
//         drawCanvas.update();
//         // let png = canvas.canvas.toDataURL();
//         // document.getElementById("ChgPngImg").src = png;
//     }

//     // tick event
//     createjs.Ticker.addEventListener("tick", handleTick);
//     function handleTick() {
//         buttons.update();
//     }


//     function createButton(name, width, height, keyColor) {
//         // create button container
//         let buttonContainer = new createjs.Container();
//         buttonContainer.name = name; 
//         buttonContainer.cursor = "pointer"; 

//         // background of button
//         let bgUp = new createjs.Shape();
//         bgUp.graphics
//             .setStrokeStyle(1.0)
//             .beginStroke(keyColor)
//             .beginFill("white")
//             .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
//         buttonContainer.addChild(bgUp);
//         bgUp.visible = true; 

//         // mouse is hover 
//         let bgOver = new createjs.Shape();
//         bgOver.graphics
//               .beginFill(keyColor)
//               .drawRoundRect(0, 0, width, height, 4);
//         bgOver.visible = false; 
//         buttonContainer.addChild(bgOver);

//         // label
//         let label = new createjs.Text(name, "18px sans-serif", keyColor);
//         label.x = width / 2;
//         label.y = height / 2;
//         label.textAlign = "center";
//         label.textBaseline = "middle";
//         buttonContainer.addChild(label);

//         // add mouse events
//         buttonContainer.addEventListener("mouseover", handleMouseOver);
//         buttonContainer.addEventListener("mouseout", handleMouseOut);

//         // when mouse is hover
//         function handleMouseOver(event) {
//             bgUp.visble = false;
//             bgOver.visible = true;
//             label.color = "white";
//         }

//         // mouse is out
//         function handleMouseOut(event) {
//             bgUp.visble = true;
//             bgOver.visible = false;
//             label.color = keyColor;
//         }

//         return buttonContainer;
//     }
// }

// use Createjs and JQuery
window.addEventListener("load", init);
function init() {

    // --------------------------------------------------------------
    // Stage1オブジェクト：WriteCanvas
    // --------------------------------------------------------------
    let drawCanvas = new createjs.Stage("WriteCanvas");

    // タッチイベントが有効なブラウザの場合、
    // CreateJSでタッチイベントを扱えるようにする
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(drawCanvas);
    }

    let shape = new createjs.Shape();   // シェイプを作成
    drawCanvas.addChild(shape);             // ステージに配置

    resetEvent();

    // ステージ上でマウスボタンを押した時のイベント設定
    drawCanvas.addEventListener("stagemousedown", handleDown);

    // マウスを押した時に実行される
    function handleDown(event) {

        let paintColor = "#000000"                      // 筆ペンの色 black: "#000000", white: "#FFFFFF"

        // 線の描画を開始
        shape.graphics
                .beginStroke(paintColor)                // 指定のカラーで描画
                .setStrokeStyle(20, "round")            // 線の太さ、形
                .moveTo(event.stageX, event.stageY);    // 描画開始位置を指定

        // ステージ上でマウスを動かした時と離した時のイベント設定
        drawCanvas.addEventListener("stagemousemove", handleMove);
        drawCanvas.addEventListener("stagemouseup", handleUp);
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
        drawCanvas.removeEventListener("stagemousemove", handleMove);
        drawCanvas.removeEventListener("stagemouseup", handleUp);
    }

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);

    function onTick() {
        drawCanvas.update(); // Stageの描画を更新
    }

    // --------------------------------------------------------------
    // Stage2オブジェクト：ButtonCanvas
    // --------------------------------------------------------------
    let buttonCanvas = new createjs.Stage("ButtonCanvas");
    buttonCanvas.enableMouseOver();

    // ボタンを作成
    let predictButton = createButton("Predict", 80, 30, "#0650c7");
    predictButton.x = 20;
    predictButton.y = 10;
    buttonCanvas.addChild(predictButton);

    let resetButton = createButton("Reset", 80, 30, "#ff6161");
    resetButton.x = 110;
    resetButton.y = 10;
    buttonCanvas.addChild(resetButton);

    // イベントを登録
    predictButton.addEventListener("click", predictEvent);
    resetButton.addEventListener("click", resetEvent);

    // Predictボタン押下イベント
    function predictEvent(event) {

        // Canvasタグから画像に変換
        drawCanvas.update();
        let png = drawCanvas.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;

        // JQueryによるPOST処理
        // javascript→pythonへPNGデータ転送
        let textData = JSON.stringify({"b64_pngdata":png});
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
                let result = JSON.parse(data.ResultSet);
                document.getElementById("ResultImg").src = result.pred_png;
                document.getElementById("ResultLabel").textContent = result.pred_label;
                document.getElementById("ResultScore").textContent = result.pred_score;
            }
        });
    }

    // Restボタン押下イベント
    function resetEvent(event) {

        // シェイプのグラフィックスを消去
        shape.graphics.clear();
        shape.graphics.beginFill("white"); // background color
        shape.graphics.drawRect(0, 0, 240, 240);
        shape.graphics.endFill();
        drawCanvas.update();
        let png = drawCanvas.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;
    }

    // 時間経過イベント
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {

        // Stage2の描画を更新
        buttonCanvas.update();
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
        let button = new createjs.Container();
        button.name = text; // ボタンに参考までに名称を入れておく(必須ではない)
        button.cursor = "pointer"; // ホバー時にカーソルを変更する

        // 通常時の座布団を作成
        let bgUp = new createjs.Shape();
        bgUp.graphics
              .setStrokeStyle(1.0)
              .beginStroke(keyColor)
              .beginFill("white")
              .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
        button.addChild(bgUp);
        bgUp.visible = true; // 表示する

        // ロールオーバー時の座布団を作成
        let bgOver = new createjs.Shape();
        bgOver.graphics
              .beginFill(keyColor)
              .drawRoundRect(0, 0, width, height, 4);
        bgOver.visible = false; // 非表示にする
        button.addChild(bgOver);

        // ラベルを作成
        let label = new createjs.Text(text, "18px sans-serif", keyColor);
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
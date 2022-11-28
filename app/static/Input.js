// use Createjs and JQuery
window.addEventListener("load", init);
function init() {
    // Draw canvas object
    let drawCanvas = new createjs.Stage("WriteCanvas");

    // enable touch Event if possible
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(drawCanvas);
    }

    let shape = new createjs.Shape();
    drawCanvas.addChild(shape);

    resetEvent();

    // set mousedown event listener
    drawCanvas.addEventListener("stagemousedown", handleDown);

    // when mouse is down
    function handleDown(event) {

        let paintColor = "#000000";

        // start to draw
        shape.graphics
            .beginStroke(paintColor)
            .setStrokeStyle(20, "round")
            .moveTo(event.stageX, event.stageY);

        // add events mouse move and up
        drawCanvas.addEventListener("stagemousemove", handleMove);
        drawCanvas.addEventListener("stagemouseup", handleUp);
    }

    // mouse move events
    function handleMove(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
    }

    // nouse is up
    function handleUp(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
        shape.graphics.endStroke();

        // release event listener
        drawCanvas.removeEventListener("stagemousemove", handleMove);
        drawCanvas.removeEventListener("stagemouseup", handleUp);
    }

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);

    function onTick() {
        drawCanvas.update(); 
    }

    // Button Canvas
    let buttonCanvas = new createjs.Stage("ButtonCanvas");
    buttonCanvas.enableMouseOver();

    // create button
    let predictButton = createButton("Predict", 80, 30, "#0650c7");
    predictButton.x = 20;
    predictButton.y = 10;
    buttonCanvas.addChild(predictButton);

    let resetButton = createButton("Reset", 80, 30, "#ff6161");
    resetButton.x = 110;
    resetButton.y = 10;
    buttonCanvas.addChild(resetButton);

    // add events
    predictButton.addEventListener("click", predictEvent);
    resetButton.addEventListener("click", resetEvent);

    // predict events
    function predictEvent(event) {

        // tranform canvas to data
        drawCanvas.update();
        let png = drawCanvas.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;

        // send png from javasrcipt to python 
        let textData = JSON.stringify({"b64_pngdata":png});
        $.ajax({
            type:'POST',
            url:'/output',
            data:textData,
            contentType:'application/json',

            // send back from python to javascript
            // if success
            success:function(data){
                // retrieve json 
                let result = JSON.parse(data.ResultSet);
                document.getElementById("ResultImg").src = result.pred_png;
                document.getElementById("ResultLabel").textContent = result.pred_label;
                document.getElementById("ResultScore").textContent = result.pred_score;
            }
        });
    }

    // reset event
    function resetEvent(event) {
        shape.graphics.clear();
        shape.graphics.beginFill("white"); 
        shape.graphics.drawRect(0, 0, 240, 240);
        shape.graphics.endFill();
        drawCanvas.update();
        let png = drawCanvas.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;
    }

    // tick event
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        buttonCanvas.update();
    }


    // create bunttn function 
    function createButton(text, width, height, keyColor) {
        let button = new createjs.Container();
        button.name = text; 
        button.cursor = "pointer"; 

        // background
        let bgUp = new createjs.Shape();
        bgUp.graphics
              .setStrokeStyle(1.0)
              .beginStroke(keyColor)
              .beginFill("white")
              .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
        button.addChild(bgUp);
        bgUp.visible = true; 

        // hover action
        let bgOver = new createjs.Shape();
        bgOver.graphics
              .beginFill(keyColor)
              .drawRoundRect(0, 0, width, height, 4);
        bgOver.visible = false; 
        button.addChild(bgOver);

        // create label
        let label = new createjs.Text(text, "18px sans-serif", keyColor);
        label.x = width / 2;
        label.y = height / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        button.addChild(label);

        // add events
        button.addEventListener("mouseover", handleMouseOver);
        button.addEventListener("mouseout", handleMouseOut);

        // mouse is hover
        function handleMouseOver(event) {
            bgUp.visble = false;
            bgOver.visible = true;
            label.color = "white";
        }

        // mouse is out
        function handleMouseOut(event) {
            bgUp.visble = true;
            bgOver.visible = false;
            label.color = keyColor;
        }

        return button;
    }
}
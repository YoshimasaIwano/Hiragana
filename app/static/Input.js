// use Createjs and JQuery
window.addEventListener("load", init);
function init() {
    // canvas object
    let canvas = new createjs.Stage("WriteCanvas");

    // enable touch Event if possible
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(canvas);
    }

    let shape = new createjs.Shape();   
    canvas.addChild(shape);             
    resetEvent();

    // set mousedown event listener
    canvas.addEventListener("stagemousedown", handleDown);

    // when mouse is down
    function handleDown(event) {
        //  black: "#000000", white: "#FFFFFF"
        let paintColor = "#000000"

        // start to draw
        shape.graphics
            .beginStroke(paintColor)
            .setStrokeStyle(20, "round") 
            .moveTo(event.stageX, event.stageY);

        // add events mouse move and up
        canvas.addEventListener("stagemousemove", handleMove);
        canvas.addEventListener("stagemouseup", handleUp);
    }

    // mouse move events
    function handleMove(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
    }

    // mouse up events
    function handleUp(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
        shape.graphics.endStroke();

        // release the move and up events
        canvas.removeEventListener("stagemousemove", handleMove);
        canvas.removeEventListener("stagemouseup", handleUp);
    }

    // To update image
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);

    function onTick() {
        canvas.update();
    }


    // Buttuon Object
    let buttons = new createjs.Stage("ButtonCanvas");
    buttons.enableMouseOver();

    // create predict button
    let pred_button = createButton("Predict", 80, 30, "#0650c7");
    pred_button.x = 20;
    pred_button.y = 10;
    buttons.addChild(pred_button);

    let reset_button = createButton("Reset", 80, 30, "#ff6161");
    reset_button.x = 110;
    reset_button.y = 10;
    buttons.addChild(reset_button);

    // add click events
    pred_button.addEventListener("click", predictEvent);
    reset_button.addEventListener("click", resetEvent);

    // predict button event 
    function predictEvent(event) {

        // trasform canvas to image
        canvas.update();
        let png = canvas.canvas.toDataURL();
        // document.getElementById("ChgPngImg").src = png;

        // JQuery
        // send data from javascript to python
        let textData = JSON.stringify({"b64_pngdata":png});
        $.ajax({
            type:'POST',
            url:'/output',
            data:textData,
            contentType:'application/json',

            success:function(data){
                let ret = JSON.parse(data.results);
                document.getElementById("ResultImg").src = ret.pred_png;
                document.getElementById("ResultLabel").textContent = ret.pred_label;
                document.getElementById("ResultScore").textContent = ret.pred_score;
            }
        });
    }

    // reset button event
    function resetEvent(event) {
        shape.graphics.clear();
        shape.graphics.beginFill("white"); 
        shape.graphics.drawRect(0, 0, 240, 240);
        shape.graphics.endFill();
        canvas.update();
        let png = canvas.canvas.toDataURL();
        // document.getElementById("ChgPngImg").src = png;
    }

    // tick event
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {
        buttons.update();
    }


    function createButton(name, width, height, keyColor) {
        // create button container
        let buttonContainer = new createjs.Container();
        buttonContainer.name = name; 
        buttonContainer.cursor = "pointer"; 

        // background of button
        let bgUp = new createjs.Shape();
        bgUp.graphics
            .setStrokeStyle(1.0)
            .beginStroke(keyColor)
            .beginFill("white")
            .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
        buttonContainer.addChild(bgUp);
        bgUp.visible = true; 

        // mouse is hover 
        let bgOver = new createjs.Shape();
        bgOver.graphics
              .beginFill(keyColor)
              .drawRoundRect(0, 0, width, height, 4);
        bgOver.visible = false; 
        buttonContainer.addChild(bgOver);

        // label
        let label = new createjs.Text(name, "18px sans-serif", keyColor);
        label.x = width / 2;
        label.y = height / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        buttonContainer.addChild(label);

        // add mouse events
        buttonContainer.addEventListener("mouseover", handleMouseOver);
        buttonContainer.addEventListener("mouseout", handleMouseOut);

        // when mouse is hover
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

        return buttonContainer;
    }
}
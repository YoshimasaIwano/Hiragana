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

    let predictButton = document.getElementById('predictBtn');
    let resetButton = document.getElementById('resetBtn');

    // add events
    predictButton.addEventListener("click", predictEvent);
    resetButton.addEventListener("click", resetEvent);

    // predict events
    function predictEvent(event) {

        // tranform canvas to data
        drawCanvas.update();
        let png = drawCanvas.canvas.toDataURL();
        document.getElementById("mainImage").src = png;

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
                document.getElementById("resultLabel").textContent = result.pred_label;
                document.getElementById("resultScore").textContent = result.pred_score;
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
        document.getElementById("mainImage").src = png;
    }
}
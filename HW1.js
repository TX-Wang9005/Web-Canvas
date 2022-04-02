var canvas;
var ctx;
var mode;
var hasInput;
var font_name;
var c_array = new Array();
var step = -1;
var x, y;
var colorBlock;
var ctx1;
var width1;
var height1;
var colorStrip;
var ctx2;
var width2;
var height2;
var colorLabel;
var drag = false;
var rgbaColor = 'rgba(0,0,0,1)';
var colorBlockImage;
var colorPickImage;


function init() {
    init_ctx();
    hasInput = false;
    font_name = "serif";
    cPush();
}

function init_ctx() {
    canvas = document.getElementById('art');
    ctx = canvas.getContext('2d');
    canvas.addEventListener("mousedown", mouseDownEvent, false);
    canvas.addEventListener("mouseup", mouseUpEvent, false);
    // color picker
    init_color_picker();
    colorBlockImage = ctx1.getImageData(0, 0, width1, height1);
    colorPickImage = ctx2.getImageData(0, 0, width2, height2);
    colorStrip.addEventListener("click", click, false);
    colorBlock.addEventListener("mousedown", mouseDownColor, false);
    colorBlock.addEventListener("mouseup", mouseUpColor, false);
    colorBlock.addEventListener("mousemove", mouseMoveColor, false);

}

function init_color_picker() {
    colorBlock = document.getElementById('color-block');
    ctx1 = colorBlock.getContext('2d');
    width1 = colorBlock.width;
    height1 = colorBlock.height;
    colorStrip = document.getElementById('color-strip');
    ctx2 = colorStrip.getContext('2d');
    width2 = colorStrip.width;
    height2 = colorStrip.height;
    colorLabel = document.getElementById('color-label');
    ctx1.rect(0, 0, width1, height1);
    fillGradient();
    ctx2.rect(0, 0, width2, height2);
    var grd1 = ctx2.createLinearGradient(0, 0, 0, height1);
    grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx2.fillStyle = grd1;
    ctx2.fill();
}
function fillGradient() {
    ctx1.fillStyle = rgbaColor;
    ctx1.fillRect(0, 0, width1, height1);

    var grdWhite = ctx2.createLinearGradient(0, 0, width1, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx1.fillStyle = grdWhite;
    ctx1.fillRect(0, 0, width1, height1);

    var grdBlack = ctx2.createLinearGradient(0, 0, 0, height1);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx1.fillStyle = grdBlack;
    ctx1.fillRect(0, 0, width1, height1);
}
function mouseDownColor(evt) {
    drag = true;
    changeColor(evt);
}

function mouseMoveColor(evt) {
    if (drag) {
        changeColor(evt);
    }
}

function mouseUpColor(evt) {
    drag = false;
}
function changeColor(evt) {
    x = evt.offsetX;
    y = evt.offsetY;
    var imageData = ctx1.getImageData(x, y, 1, 1).data;
    rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    colorLabel.style.backgroundColor = rgbaColor;
    ctx1.putImageData(colorBlockImage, 0, 0);
    ctx1.beginPath();
    ctx1.moveTo(x - 4, y - 4);
    ctx1.lineTo(x + 4, y + 4);
    ctx1.moveTo(x + 4, y - 4);
    ctx1.lineTo(x - 4, y + 4);
    ctx1.stroke();
}
function click(e) {
    x = e.offsetX;
    y = e.offsetY;
    var imageData = ctx2.getImageData(x, y, 1, 1).data;
    rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    colorLabel.style.backgroundColor = rgbaColor;
    fillGradient();
    ctx2.putImageData(colorPickImage, 0, 0);
    ctx2.beginPath();
    ctx2.moveTo(x - 30, y);
    ctx2.lineTo(x + 30, y);
    ctx2.stroke();
    colorBlockImage = ctx1.getImageData(0, 0, width1, height1);

}
////////////////////////////////////////////////////////////
function switchMode(button) {
    mode = button.id;
    document.getElementById("mode").value = button.id;
    if (mode === "brush") {
        canvas.style.cursor = "url('Image/brush-fill.svg'), auto";
    }
    else if (mode === "eraser") {
        canvas.style.cursor = "url('Image/eraser-fill.svg'), auto";
    }
    else if (mode === "text") {
        canvas.style.cursor = "url('Image/text-right.svg'), auto";
    }
    else if (mode === "circle") {
        canvas.style.cursor = "url('Image/circle.svg'), auto";
    }
    else if (mode === "rectangle") {
        canvas.style.cursor = "url('Image/square.svg'), auto";
    }
    else if (mode === "triangle") {
        canvas.style.cursor = "url('Image/triangle.svg'), auto";
    }
    else if (mode === "line") {
        canvas.style.cursor = "url('Image/slash-lg.svg'), auto";
    }
    else {
        canvas.style.cursor = "crosshair";
    }

}

function Reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cPush();
    mode = "reset";
    canvas.style.cursor = "crosshair";
    document.getElementById("mode").value = "reset";
}
///////////////////////////////////////////////
function switchFont(button) {
    font_name = String(button.id);
    document.getElementById("font_type").innerHTML = font_name;
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = rgbaColor;
    font_size = document.getElementById("text_size").value;
    font = String(font_size) + "px " + font_name;
    console.log(font)
    ctx.font = font;
    ctx.fillText(txt, x - 4, y - 4);
    cPush();
}
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}
//////////////////////////////////////////////////////
function doInput() {
    var inputObj = document.createElement('input');
    inputObj.addEventListener('change', readFile, false);
    inputObj.type = 'file';
    inputObj.accept = 'image/*';
    inputObj.id = "upload_image";
    inputObj.click();
}

function readFile() {
    var file = this.files[0];//獲取input輸入的圖片
    console.log(file.type)
    var reader = new FileReader();
    reader.readAsDataURL(file);//轉化成base64資料型別
    reader.onload = function (e) {
        drawToCanvas(this.result);
    }
}

function drawToCanvas(imgData) {
    var img = new Image;
    img.src = imgData;
    img.onload = function () {//必須onload之後再畫
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    mode = "upload"
    document.getElementById("mode").value = mode;
    canvas.style.cursor = "crosshair";
}

///////////////////////////////////////////////////////
function download() {
    console.log("download")
    let imgSrc = canvas.toDataURL();
    console.log(imgSrc)
    let imgName = 'test.jpg';
    downloadImg(imgSrc, imgName);
    mode = "download"
    document.getElementById("mode").value = mode;
    canvas.style.cursor = "crosshair";
}
function downloadImg(imgSrc, imgName) {
    let elem = document.createElement('a');
    elem.setAttribute('href', imgSrc);
    elem.setAttribute('download', imgName);
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}
///////////////////////////////////////////////////////////

function cPush() {
    step++;
    if (step < c_array.length) {
        c_array.length = step;
    }
    c_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undo() {
    if (step > 0) {
        step--;
        ctx.putImageData(c_array[step], 0, 0);
        mode = "undo";
        document.getElementById("mode").value = mode;
        canvas.style.cursor = "crosshair";
    }
}

function redo() {
    if (step < c_array.length - 1) {
        step++;
        ctx.putImageData(c_array[step], 0, 0);
        mode = "redo";
        document.getElementById("mode").value = mode;
        canvas.style.cursor = "crosshair";
    }
}

//////////////////////////////////////////////////////////
function mouseDownEvent(evt) {
    var mousePos = getMousePos(canvas, evt);
    if (mode === "brush") {
        isDrawing = true;
        ctx.lineWidth = document.getElementById("brush_size").value / 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = rgbaColor;
        evt.preventDefault();
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        canvas.addEventListener('mousemove', mouseMove, false);
    }
    else if (mode === "eraser") {
        isDrawing = true;
        ctx.lineWidth = document.getElementById("brush_size").value / 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalCompositeOperation = "destination-out"
        evt.preventDefault();
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        canvas.addEventListener('mousemove', mouseMove, false);
    }
    else if (mode === "text" && hasInput === false) {
        var input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'fixed';
        input.style.left = (mousePos.x - 4) + 'px';
        input.style.top = (mousePos.y - 4) + 'px';
        input.onkeydown = handleEnter;
        document.body.appendChild(input);
        input.focus();
        hasInput = true;
    }
    else if (mode === "line" || mode === "rectangle" || mode === "circle" || mode === "triangle") {
        isDrawing = true;
        ctx.lineWidth = document.getElementById("brush_size").value / 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = rgbaColor;
        curImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        evt.preventDefault();
        x = mousePos.x;
        y = mousePos.y;
        canvas.addEventListener('mousemove', mouseMove, false);
    }
}

////////////////////////////////////////////////////////
function mouseMove(evt) {
    if (mode === "brush") {
        if (isDrawing) {
            var mousePos = getMousePos(canvas, evt);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
    }
    else if (mode === "eraser") {
        if (isDrawing) {
            var mousePos = getMousePos(canvas, evt);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
    }
    else if (mode === "line") {
        if (isDrawing) {
            ctx.putImageData(curImage, 0, 0);
            ctx.beginPath();
            ctx.moveTo(x, y);
            var mousePos = getMousePos(canvas, evt);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
    }
    else if (mode === "rectangle") {
        if (isDrawing) {
            var mousePos = getMousePos(canvas, evt);
            ctx.putImageData(curImage, 0, 0);
            ctx.strokeRect(x, y, mousePos.x - x, mousePos.y - y);
        }
    }
    else if (mode === "circle") {
        if (isDrawing) {
            var mousePos = getMousePos(canvas, evt);
            ctx.putImageData(curImage, 0, 0);
            ctx.beginPath();
            ctx.arc(x, y, Math.sqrt((mousePos.x - x) ** 2 + (mousePos.y - y) ** 2), 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    else if (mode === "triangle") {
        if (isDrawing) {
            var mousePos = getMousePos(canvas, evt);
            ctx.putImageData(curImage, 0, 0);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.lineTo(mousePos.x + (x - mousePos.x) * 2, mousePos.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
};

function mouseUpEvent() {
    if (mode === "brush" || mode === "eraser" || mode === "line" || mode === "rectangle" || mode === "circle" || mode === "triangle") {
        isDrawing = false;
        cPush();
    }
}

///////////////////////////////////////////////////////
window.onload = function () {
    init();
}

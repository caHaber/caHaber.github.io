
var selectionComplete = 0;
var colorPicked;
// Line seg is mouseX, mouseY, pmouseX, pmouseY
var path = {lineSegs: [], width: null, height: null, strokeColor: null, strokeWidth: 10};

var xhr = new XMLHttpRequest();
var URL = 'http://localhost:3000'


var pallete = [
    '#DAF7A6',
    '#FFC300',
    '#FF5733',
    '#C70039',
    '#900C3F',
    '#581845',
    '#40EDC8',
    '#E29FEC',
    '#B6C4FA'];


function setup() {
   createCanvas(windowWidth, windowHeight); 
//    strokeWeight(+path.strokeWidth)
//    stroke(path.strokeColor);
   path.height = windowHeight;
   path.width = windowWidth;
   strokeWeight(0);
   drawColorChoices();
   strokeWeight(+path.strokeWidth);
//    noDraw();
   noLoop();
}

var circleSize = 0;

function draw(){
    if(!selectionComplete && circleSize != 0){
        ellipse(windowWidth/2,windowHeight/2,circleSize,circleSize);
    }
    if(circleSize > windowWidth *1.315 && circleSize > windowHeight*1.315){
        selectionComplete = 1;
        fill("none");
        clear();
        noLoop();
    }
    else{
        circleSize = circleSize + 20;
    }
}


function drawColorChoices(){
    var color = 0;
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            fill(pallete[color]);
            rect(i * (windowWidth/3), j * (windowHeight/3), windowWidth/3, windowHeight/3);
            color++;
        }
    }
}

function touchStarted() {
    if(!selectionComplete) {
        colorPicked = get(mouseX,mouseY);
        stroke(colorPicked[0],colorPicked[1],colorPicked[2],colorPicked[3]);
        fill("white");
        loop();
        return false;
    }
    path.lineSegs = [];
    return false;
}

function touchMoved() {
   if(!selectionComplete) return false;
   if(path.lineSegs.length === 0){
      pmouseX = mouseX;
      pmouseY = mouseY;
   } 
   path.lineSegs.push({x:mouseX, y:mouseY, px:pmouseX, py: pmouseY})
//    console.log(mouseX, mouseY, pmouseX, pmouseY);
   line(mouseX, mouseY, pmouseX, pmouseY);
   pmouseX = mouseX;
   pmouseY = mouseY;
   return false;
}

function touchEnded() {
    if(!selectionComplete) return false;
    sendLineData();
    return false;
 }


sendLineData = () => {
        console.log(path);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        path.lineSegs = JSON.stringify(path.lineSegs);
        path.strokeColor = colorPicked;
        xhr.send(JSON.stringify(path));
}
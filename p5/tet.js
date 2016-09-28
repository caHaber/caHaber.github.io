
function setup() {
  createCanvas(1720, 1400);
  frameRate(.5)
};

function draw() {

        s = "Casey Haber";
        fill(23,123,212);

        text(s, 100, 100, 100, 100);
        stroke(10)
        var x = 0;
        if (x/1000 === 0){
            textSize(textSize()+100)
            textLeading(12200)
            textSize(random(1000));
        }
        x++;
        strokeWeight(.001);



}

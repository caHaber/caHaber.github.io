


var nodes = [],
    links = [],
    width = 1500,
    height = 1500;

    var path = d3.geo.path(),
        force = d3.layout.force().size([width, height]);
    //     var svg = d3.select("body").append("svg")
    // .attr("width", width)
    // .attr("height", height);

var image = "art/redPink.svg"

d3.xml(image, "image/svg+xml", function(error, xml) {
  if (error) throw error;
  var svgNode = xml
                .getElementsByTagName("svg")[0];

    console.log(svgNode);


  draw(svgNode);



});


function draw(svgNode) {



    var paths = d3.select(svgNode).selectAll("path");

    var arrPaths = [];


    paths[0].forEach(function(s){
        var me = d3.select(s);
        var feature = {};

        arrPaths.push(me.node());
    })



    var svg = d3.select("body").append("svg").attr("id","art").attr("width","3500").attr("height","2000");






        var donePaths =  svg.selectAll("path")
                      .data(arrPaths)
                     .enter().append("path")
                      .attr("d",function(d){
                          var me = d3.select(d);
                        //   console.log(d,"rawD");
                          // console.log(me.attr("d"));
                          return me.attr("d")
                      })
                      .attr("class",function(d){
                          return d.classList[0];

                      });

                      features = [];



svg.on("click",click);

    function click(){
        donePaths
           .transition()
           // .ease("elastic-out")
           .ease("cubic-in-out")
           .delay(function(d,i){return (Math.random() * 400) * 20})
           // .duration(500).attr("transform",function(d){return "translate(0,-1000)" + " scale(" + (Math.random()* (5 - .1) + .1) + ")"});
           // node.transition()
           .duration(5500)
           .attr("transform",function(d){
               // return "translate(" + (Math.floor(Math.random() * 501) - 500) + ",-2700)" +
                return "translate(" + (0) + ", 0)" +
               " scale(" + (Math.random()* (10 - .00001) + .00001) + ")"
               // "rotate(-180, " + d[0] + ", " + d[1] + ")";
           });
    }

}

function getMyCentroid(bbox) {
    console.log(bbox);
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

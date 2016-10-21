


    var nodes = [],
        links = [],
        width = 1500,
        height = 1500;

        var path = d3.geo.path(),
            force = d3.layout.force().size([width, height]);
        //     var svg = d3.select("body").append("svg")
        // .attr("width", width)
        // .attr("height", height);

    var image = "img/ch.svg"
    var flag = true;
    d3.xml(image, "image/svg+xml", function(error, xml) {
      if (error) throw error;
      var svgNode = xml
                    .getElementsByTagName("svg")[0];

        // console.log(svgNode);


      draw(svgNode);






    function draw(svgNode) {



        var paths = d3.select(svgNode).selectAll("path");

        var arrPaths = [];


        paths[0].forEach(function(s){
            var me = d3.select(s);
            var feature = {};

            arrPaths.push(me.node());
        })



        var svg = d3.select("svg").attr("width","3500").attr("height","2000");



    svg.append("text")
        .text("Click")
        .attr("x",200)
        .attr("y",20);



            var donePaths =  svg.selectAll("path")
                          .data(arrPaths)
                         .enter().append("path")
                          .attr("d",function(d){
                              var me = d3.select(d);
                            //   console.log(d,"rawD");

                              return me.attr("d")
                          })
                          .attr("fill",function(d){
                              return d3.select(d).attr("fill");
                          })
                          .attr("stroke",function(d){
                                return d3.select(d).attr("stroke");
                            });

                        //GIVES Random st class for color brewer pallets

                        //   .attr("class",function(d){
                        //     //   return d.classList[0];
                        //     var run = ran((Math.random()* (8 - 0) + 0));
                        //     // console.log("st"+run)
                        //     return "st" + run;
                          //
                        //   });

                          features = [];

    var animations = ["slideUp","slideLeft","slideDown","bounce","pulse","bigEntrance","hatch","tossing"];



    svg.on("click",click);



    //Attaches animations
    // donePaths.on("mouseover",function(d){
    //     var me = d3.select(this);
    //     // me.style("fill","white");
    //     // me.style("opacity",".5");
    //     var run = ran((Math.random()* (7 - 0) + 0));
    //     me.attr("class", function(s) {
    //         // var me = d3.select(d);
    //         // console.log(d3.select(d));
    //         return animations[run];
    //     });
    //     // console.log(animations[run])
    // })

    function ran(x){
        if (x >= 3 && x <4){
            return 3
        }
        if (x >= 4 && x <5){
            return 4
        }
        if (x >= 2 && x <3){
            return 2
        }
        if (x >= 1 && x <2){
            return 1
        }
        if (x >= 0 && x <1){
            return 0
        }
        if (x >= 5 && x <6){
            return 5
        }
        if (x >= 6 && x <7){
            return 6
        }
        if (x >= 7 && x <8){
            return 7
        }
        if (x >= 8 && x <9){
            return 8
        }
    }

    setTimeout(function() {
        animate();
    }, 1000);

        function click(){
            // if (flag == true){
            //     flag = false;
                reset();
                // return;

            // }
            // else {
            //     flag = true;
            // }

        }

function animate() {
    console.log("yo");
    donePaths
       .transition()
       // .ease("elastic-out")
       .ease("cubic-out")
       .delay(function(d,i){return (Math.random() * 400) * 20})
       // .duration(500).attr("transform",function(d){return "translate(0,-1000)" + " scale(" + (Math.random()* (5 - .1) + .1) + ")"});
       // node.transition()
       .duration(5500)
       .attr("transform",function(d){
           // return "translate(" + (Math.floor(Math.random() * 501) - 500) + ",-2700)" +
            return "translate(" + (0) + ", 0)" +
           " scale(" + (Math.random()* (20 - .001) + .001) + ")"
           // "rotate(-180, " + d[0] + ", " + d[1] + ")";
       });
}








    }

    function reset() {
        console.log("reset")
        d3.selectAll("path").remove();
        var svg = d3.select("svg");
        draw(svgNode)


    }



    });




    function getMyCentroid(bbox) {
        // console.log(bbox);
        return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
    }
 //1 second











var width = d3.select("div.brain").node().getBoundingClientRect().width,
    height = 600,
    clone1;

var path = d3.geo.path(),
    force = d3.layout.force()
        // force2 = d3.layout.force().size([width, height]);

        var dotSide = 7,
            dotSep   = 1,
            logoXPadding = 2 * dotSide,
            logoYPadding = 2 * dotSide,
            h = Math.floor(logoXPadding / 2) - 0.5 * dotSide;
            v = Math.floor(height - logoYPadding / 2) - 0.5 * dotSide;



// var params = {
//     charge: { min: -1000, max: 100, step: 5, value: -190 },
//     linkDistance: { min: 0, max: 1000, step: 5, value: 30 },
//     linkStrength: { min: 0, max: 100, step: 0.05, value: 1 },
//     gravity: { min: -1, max: 1, step: 0.05, value: 0.1 },
//     friction: { min: 0, max: 1, step: 0.05, value: 0.7 },
//     theta: { min: 0, max: 1, step: 0.05, value: 0.8 }
// };
//
// function onSlide(param) {
//     return function(e, ui) {
//         $(this).closest('li').find('.value').text(ui.value);
//         force[param](ui.value);
//         params[param].value = ui.value;
//         force.start();
//     };
// }
//
// $('.controls div').each(function() {
//     var param = $(this).attr('id');
// console.log(param);
//     // $(this).slider({
//     //     slide: onSlide(param),
//     //     min: params[param].min,
//     //     max: params[param].max,
//     //     step: params[param].step,
//     //     value: params[param].value
//     // });
// });



    var nodes = [],
        links = [];

    var svgNode;

    var flag = true;


d3.xml(" http://camusgroup.com/wp-content/uploads/2016/07/LogoBlackMed.svg", "image/svg+xml", function(error, xml) {
  if (error) throw error;
    svgNode = xml
                .getElementsByTagName("svg")[0];

    draw();
});

function draw() {

    var nodes = [];
    var links = [];


    var svg = d3.select("div.brain").append("svg")
        .attr("width", width)
        .attr("height", height).append("g").attr("transform","translate("+ (0) + "," + (300) + ")");


  // draw(svgNode);

  //FROM MBOSTOCK FORCE STATES BLOCK
  var circles = d3.select(svgNode).selectAll("circle")[0];
  var paths = d3.select(svgNode).selectAll("path")[0];


 var newPaths = svg.append("g").classed("oldPaths",true).selectAll("path")
        .data(paths).enter()
        .append("path")
         .attr("d",function(d){
             var me = d3.select(d);
           //   console.log(d,"rawD");
             // console.log(me.attr("d"));
             return me.attr("d")
         })
         .attr("class",function(d){
             return d.classList[0];
         });


          var oldCircles = svg.append("g").classed("oldCircles",true).selectAll("circle")
                 .data(circles).enter()
                 .append("circle")
                  .attr("cx",function(d){
                      var me = d3.select(d);
                    //   console.log(d,"rawD");
                      return me.attr("cx")
                  })
                  .attr("cy",function(d){
                      var me = d3.select(d);
                    //   console.log(d,"rawD");
                      // console.log(me.attr("d"));
                      return me.attr("cy")
                  })
                  .attr("r", function(d) {
                      return d.r.baseVal.value})
                  .attr("class",function(d){
                      return d.classList[0];
                  });


  var arrCircles = [];
  var arrPaths = [];





  oldCircles[0].forEach(function(s){
      var me = d3.select(s);
      // console.log(me.node());
      arrCircles.push(me.node());

      var centroid = getMyCentroid(me.node())
      if (centroid.some(isNaN)) return;
        centroid.x = centroid[0];
        centroid.y = centroid[1];
        // centroid.fixed = !0,
        centroid.radius = 0;

        //DECIDE WHAT TO MAKE AS THE "FEATURE" cant get a real feature
        centroid.feature = me.node();
        centroid.class = me.attr("class");
        nodes.push(centroid);

  })

  newPaths[0].forEach(function(s){
      var me = d3.select(s);
      // console.log(me.node());
      arrPaths.push(me.node());
      var centroid = getMyCentroid(me.node())
      if (centroid.some(isNaN)) return;
        centroid.x = centroid[0];
        centroid.y = centroid[1];
        if(me.classed("st9"))
        centroid.fixed = !0;
        centroid.radius = 0;

        //DECIDE WHAT TO MAKE AS THE "FEATURE" cant get a real feature
        centroid.feature = me.attr("d");
        centroid.class = me.attr("class");
        //

      nodes.push(centroid);
  })



// var total = nodes.push(circles);
// console.log(total,"both");

  d3.geom.voronoi().links(nodes).forEach(function(link) {
    var dx = link.source.x - link.target.x,
        dy = link.source.y - link.target.y;
    link.distance = Math.sqrt(dx * dx + dy * dy);
    links.push(link);
  });





svg.select("g.oldPaths").remove();
svg.select("g.oldCircles").remove();

// console.log(nodes);

nodes.unshift({x: 1e4, y: 1e4}); // insert root node
var root = nodes[0];
root.radius = 0;
root.fixed = true;



force
    //   .gravity(params.gravity.value)
        // .linkStrength(1.5)
         .linkStrength(5)
    //     .friction(params.friction.value)
      .nodes(nodes)
      .links(links)
    // .charge(function(d, i) { return i ? 0 : -400; })
    .charge(-100)
      .linkDistance(function(d,i) {return d.distance; })
      .size([width*1.5,height])
        // .theta(3)

      .gravity(0)
    // .charge(function(d, i) { return i ? 0 : -150; })
        // .linkDistance(0.1)







      .start();


      var drag = force.drag();
        //   .on("dragend", dragend)
        //   .on("dragstart", dragstart);

    flag = false;


//   var link = svg.selectAll("line")
//       .data(links)
//      .enter().append("line")
//       .attr("x1", function(d) { return d.source.x; })
//       .attr("y1", function(d) { return d.source.y; })
//       .attr("x2", function(d) { return d.target.x; })
//       .attr("y2", function(d) { return d.target.y; });


  var node = svg.selectAll("g")
      .data(nodes);

    node.enter().append("g")
      .attr("transform", function(d) {return "translate(" + -d.x + "," + -d.y + ")"; })
      .call(drag)
    .append("path")
    //   .attr("transform", function(d,i) {if (typeof d != 'undefined')return; if(d.feature[0] === "M") return "translate(" + d.x + "," + d.y + ")"; })
      .attr("d", function(d,i) { if(i === 0) return; if(d.feature[0] === "M") return d.feature ;})
      .attr("class", function(d,i) {if(i === 0) return; if(d.feature[0] === "M") return d.class});


    node.append("g")
      .call(drag)
     .append("circle")
        .attr("cx", function(d,i) {if(i === 0) return; if(d.feature[0] !== "M") return d.feature.cx.baseVal.value; })
        .attr("cy", function(d,i) {if(i === 0) return; if(d.feature[0] !== "M") return d.feature.cy.baseVal.value; })
        .attr("r", function(d,i) {if(i === 0) return; if(d.feature[0] !== "M")  return d.feature.r.baseVal.value})
        .attr("class",function(d,i){
            if(i === 0) return;
            if(d.feature[0] !== "M")
            return d.feature.classList[0] + " " + "ball";
        });


    //  .on("dragstart",dragstart).on("dragend",dragend);

    //   var endCircles = svg.selectAll("circle")
    //        .data(arrCircles)
    //      .enter().append("circle").call(drag2)
    //      .attr("class",function(d){
    //          return d.classList[0];
    //      })
    //      .attr("cx", function(d) {return d.cx.baseVal.value; })
    //      .attr("cy", function(d) { return d.cy.baseVal.value; })
    //      .attr("r", function(d) {
    //          return d.r.baseVal.value});


//http://bl.ocks.org/mbostock/3750558
//Sticky force on the words/balls
// d3.selectAll("circle.ball").classed("fixed",function(d)
//     {d.fixed = true });
//
//  d3.selectAll("path.st9").classed("fixed",function(d)
//     {d.fixed = true });


//http://bl.ocks.org/espinielli/874de501ebf175d84fef PRU logo
svg

  .on("mousemove", mausIn)
  .on("touchmove", mausIn)
  .on("mouseout", mausOut)
  .on("touchend", mausOut);

d3.select("svg")   .on("click",click);

var clickF = false;
function click(){

    // force.gravity(-.01)

    if(clickF) {



        // force.start();

        // force
        // .linkDistance(function(d,i) {return d.distance})
        addNodes();


        clickF = false;
    } else {

    //  d3.selectAll("path").transition()
    //   .duration(2750)
    // //   .attr("transform",function(d,i){return "translate(" + i +"," + i + ")" + "scale(" + i +")" });
    // .style("transform","scale(2)")

        node.transition().duration(500).attr("transform",function(d){return "translate(0,-1000)" + " scale(" + (Math.random()* (5 - .1) + .1) + ")"});
// node.transition().duration(2500).attr("transform",function(d){return "translate(0,-3000)"});

        force
        .linkDistance(function(d,i) {if(d3.select(d)[0][0].target.class !== "st9") return d.distance*10;
        else return d.distance})
        .gravity(.1)
         .friction(.02)
        clickF = true
        force.start();
    }

}

function mausOut() {
  var p1 = d3.mouse(this);
  root.px = root.py = 1e4;
  force.resume();
}

function mausIn() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
}


  force.on("tick", function(e) {

     var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length;

//   while (++i < n) q.visit(collide(nodes[i]));


    svg.selectAll("path").attr("transform", function(d,i) {
        if(isNaN(d.x) || isNaN(d.y)) return;
      return "translate(" + d.x + "," + d.y + ")";
    });

    svg.selectAll("circle").attr("transform", function(d,i) {
        if(isNaN(d.x)) return;
        if(isNaN(d.y)) return;
      return "translate(" + d.x + "," + d.y + ")";
    });

//END OF TICK
  });

  // force2.on("tick", function(e) {
  //
  //     var q = d3.geom.quadtree(endCircles),
  //         i = 0,
  //         n = endCircles.length;
  //
  //
  //
  //     while (++i < n) q.visit(collide(endCircles[i]));
  //
  //     svg.selectAll("circle")
  //         .attr("cx", function(d) { return d.x; })
  //         .attr("cy", function(d) { return d.y; });
  //
  //
  //   if(e.alpha <= .0051){}
  //       force2.resume();
  //   //END OF FORCE TICK
  // });


  //END OF XML LOADING

}

var myVar = setInterval(addNodes, 20000);


function getMyCentroid(element) {
    var me = d3.select(element);
    var bbox = me.node().getBBox();
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

function dragstart(d) {
    clone1 = JSON.parse(JSON.stringify(nodes));
    // console.log(clone1);
}

function addNodes() {
        d3.selectAll("svg")
                .remove();
         draw();
}

function showLinks() {
    if (!flag) {
        d3.selectAll("line").style("stroke","lightgray");
        flag = true;
    } else {
        flag = false
        d3.selectAll("line").style("stroke","none");
    }
}

function dragend(d) {

    // d3.selectAll("path")
    // .attr("transform", function(d) {
    //     console.log(d);
    //   return "translate(" + (d[0] + "," + d[1] + ")";
    // });

    //   .attr("x", function(d) {console.log(d);return d[0]; })
    //   .attr("y", function(d) { return d[1]; });
    //
    // clone1.forEach(function(n,i){
    //     var me = d3.select(nodes[i]);
    //
    //     nodes[i].px = me[0][0].x;
    //     nodes[i].py = me[0][0].y
    //     nodes[i].x = me[0][0].px
    //     nodes[i].y = me[0][0].py
    //     force.nodes(nodes);
    //     force.resume();

        // d3.select(nodes[i]).attr("transform", function(d) {
        //   return "translate(" + n[0] + "," + n[1] + ")";
        // });
    //
    // });
 }

 function collide(node) {
   var r = node.radius + 16,
       nx1 = node.x - r,
       nx2 = node.x + r,
       ny1 = node.y - r,
       ny2 = node.y + r;
   return function(quad, x1, y1, x2, y2) {
       if(x1 === NaN) return;
       if(x2 === NaN) return;
       if(y1 === NaN) return;
       if(y2 === NaN) return;
     if (quad.point && (quad.point !== node)) {
       var x = node.x - quad.point.x,
           y = node.y - quad.point.y,
           l = Math.sqrt(x * x + y * y),
           r = node.radius + quad.point.radius;
       if (l < r) {
         l = (l - r) / l * .5;
         node.x -= x *= l;
         node.y -= y *= l;
         quad.point.x += x;
         quad.point.y += y;
       }
     }
     return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
   };
 }

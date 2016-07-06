

function drawGeo(){


var flag = 2006;
// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 10,
  center: new google.maps.LatLng(34.000829,-118.5058396),
  mapTypeId: google.maps.MapTypeId.TERRAIN,
  disableDefaultUI: true,
  styles:[{"stylers": [{"saturation": -45},{"lightness": 25}]}]
});
var quantize = d3.scale.sqrt()
    .domain([0, 110])
    .range([8,12]);

    var color = d3.scale.threshold()
        .domain([-100,-10,0,10,100])
        .range(['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'].reverse());



var circles;
// Load the station data. When the data comes back, create an overlay.
d3.csv("WaterAverage.csv", function(error, data) {
  if (error) throw error;

  var overlay = new google.maps.OverlayView();
  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {


    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "stations");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 30;

      var marker = layer.selectAll("svg")
          .data(data)
          .each(transform) // update existing markers
        .enter().append("svg")
          .each(transform)
          .attr("class", "marker");

console.log(marker);
console.log(data,"geo");
      // Add a circle.
    circles =  marker.append("circle")
    .attr("class",function(d,i){return "W" + i})
    .attr("class","map")
        //   .attr("r", function(d){return quantize(d["FY 05/06"])})
        //   .attr("fill",function(d){return color(+d["FY 05/06"])})
          .attr("cx", padding)
          .attr("cy", padding);


    // circles.transition().delay(2000).duration(3000)
        //   .attr("r", function(d){return quantize(d["FY 10/11"])})
        // //   .attr("fill",function(d){return color(+d["FY 10/11"])});
        // .attr("fill","black");

      // Add a label.
    //   marker.append("text")
    //       .attr("x", padding + 7)
    //       .attr("y", padding)
    //       .attr("dy", ".31em")
    //       .text(function(d) {return d["FY 11/12"]; });

      function transform(d) {
          d = new google.maps.LatLng(pointCoverter(d["Location 1"])[1], pointCoverter(d["Location 1"])[0]);
          d = projection.fromLatLngToDivPixel(d);
        //   console.log(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("width", "100px")
              .style("height", "100px")
              .style("top", (d.y - padding) + "px");
      }
    };
  };



  // Bind our overlay to the map…
  overlay.setMap(map);


  d3.select("div#notes").append("p")
        .attr("x", 0)
        .attr("id","description")
        .html(function(d,i) {
           return  "This map shows whether each Los Angeles zipcode's water consumption increased or decreased over each year. The size is a reflection of total water used during that financial year." +
           "Wait for 2011-2012!!";
       });

       d3.select("div#beeNotes").append("p")
             .attr("x", 0)
             .attr("id","description")
             .html(function(d,i) {
                return  "Each point is a zipcode. The size of each point shows the total population in the year 2010 (USCensus). Hover to see comparison across categories";
            });

var legendDiv = d3.select("html").append("svg").attr("id","legendDiv");
       var legend = d3.legend.color()
           .shape("path", d3.svg.symbol().type("circle").size(150)())
             .shapePadding(10)
             .scale(color);

    //    var legendSize = d3.legend.size()
    //          .scale(quantize)
    //          .shape('circle')
    //          .shapePadding(15)
    //          .labelOffset(20)
    //          .labelFormat(format)
    //          .orient('vertical');


       legendDiv.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(20,20)");

            // legendDiv.append("g")
            //      .attr("class", "legendSize")
            //      .attr("transform", "translate(100,280)");


       legendDiv.select(".legend")
         .call(legend);
         //
        //  legendDiv.select(".legendSize")
        //    .call(legendSize);


});

var pointCoverter = function(points){
  var LatLng = points.replace("(", "").replace(")", "").split(", ");
  var Lat = parseFloat(LatLng[0]);
  var Lng = parseFloat(LatLng[1]);
  return [Lng,Lat];
}

var first = true;
var autoCycle = setInterval(function (){
    console.log(flag);
    d3.selectAll("tspan").remove();

    circles = d3.selectAll("circle.map");

    d3.select("div#map").append("tspan")
          .attr("x", 0)
          .attr("id","year")
          .html(function(d,i) {
             return  (flag-1) + " - " + (flag);
         });


// console.log(+d["FY 08/09"] - +d["FY 07/08"])

    switch(flag) {



  case 2006:
  if(!first){
      circles.transition().duration(2000)
        .attr("r", function(d){return quantize(+d["FY 06/07"])})
        .attr("fill",function(d){return color(+d["FY 06/07"] - +d["FY 05/06"])});
        flag=2007;
        break;
  } else {
      circles
        .attr("r", function(d){return quantize(+d["FY 06/07"])})
        .attr("fill",function(d){return color(+d["FY 06/07"] - +d["FY 05/06"])});
        flag=2007;
        first = false;
        break;
  }


    case 2007:
    circles.transition().duration(2000)
      .attr("r", function(d){return quantize(+d["FY 07/08"])})
      .attr("fill",function(d){return color(+d["FY 07/08"] - +d["FY 06/07"])});
      flag=2008;
      break;

      case 2008:
      circles.transition().duration(2000)
        .attr("r", function(d){return quantize(+d["FY 08/09"])})
        .attr("fill",function(d){return color(+d["FY 08/09"] - +d["FY 07/08"])});
        flag=2009;
        break;

        case 2009:
        circles.transition().duration(2000)
          .attr("r", function(d){return quantize(+d["FY 09/10"])})
          .attr("fill",function(d){return color(+d["FY 09/10"] - +d["FY 08/09"])});
          flag=2010;
          break;

          case 2010:
          circles.transition().duration(2000)
            .attr("r", function(d){return quantize(+d["FY 10/11"] )})
            .attr("fill",function(d){return color(+d["FY 10/11"] - +d["FY 09/10"])});
            flag=2011;
            break;

            case 2011:
            circles.transition().duration(2000)
              .attr("r", function(d){return quantize(+d["FY 11/12"] )})
              .attr("fill",function(d){return color(+d["FY 11/12"] - +d["FY 10/11"])});
              flag=2012;
              break;

              case 2012:
              circles.transition().duration(2000)
                .attr("r", function(d){return quantize(+d["FY 12/13"])})
                .attr("fill",function(d){return color(+d["FY 12/13"] - +d["FY 11/12"])});
                flag=2006;
                break;
    }
}, 3000);

}

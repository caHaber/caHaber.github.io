
function drawPie(div){
    var width = d3.select(div).node().getBoundingClientRect().width - 10,
        height = 600;

    var svg = d3.select(div).append("svg")
        .attr({
            width : width,
            height : height
        });

        var color = d3.scale.ordinal()
            .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c']);


    var plotHeight = height - 100,
        plotWidth = width - 150

 var radius = Math.min(plotWidth, plotHeight) / 2;

var outerRadius = radius - 10;

 var arc = d3.svg.arc()
     .outerRadius(outerRadius)
     .innerRadius(radius - 100);

 var labelArc = d3.svg.arc()
     .outerRadius(radius - 40)
     .innerRadius(radius - 40);

 var pie = d3.layout.pie()
     .sort(null)
     .value(function(d) { return d.value; });


        var plot = svg.append("g")
            .attr({
                width : plotWidth,
                height : plotWidth
            })
            .attr("transform", "translate(" + plotWidth/2 + "," + (plotHeight/2 + 50) + ")");

        d3.csv("Water_Use_Breakdown_Chart.csv",accessor, function(error, data) {
          if (error) throw error;

    var users = data.map(function(d){return d.user});

    // console.log(users);

          color.domain(users)

          console.log(data);

          var g = plot.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .attr("class", "arc");

          g.append("path")
              .attr("d", arc)
              .attr("class",function(d){return  "" + (d.data.user).slice(0,3)})
              .style("fill", function(d) {return color(d.data.user); });

         var texts = g.append("text")
         .attr("transform", function(d) { //set the label's origin to the center of the arc
                 var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                  return "translate(" + (x/h * radius) +  ',' +
                     (y/h * radius) +  ")";
            })
              .attr("dx", "-1em")
            //    .attr("dy", "1em")
              .attr("font-size",".9em")
               .attr("text-anchor","middle")

              .text(function(d) { return d.data.user +  "" + d.data.value + " %"; });

              texts.moveToFront()

        });



}

function drawBar(){
    var width = d3.select("div#title").node().getBoundingClientRect().width - 10,
        height = 350;

    var svg = d3.select("div#title").append("svg")
        .attr({
            width : width,
            height : height
        });

    var format = d3.format("%");

        var color = d3.scale.ordinal()
            .domain([0, 300])
            .range(['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']);;

    var plotHeight = height - 30,
        plotWidth = width - 150

        var plot = svg.append("g")
            .attr({
                width : plotWidth,
                height : plotWidth
            })
            .attr("transform", "translate(" + 130 + "," + 10 + ")");

            var y = d3.scale.ordinal()
            .rangeRoundBands([0, plotHeight], .1);

              var x = d3.scale.linear()
                  .range([plotWidth, 0]);

            //   var color = d3.scale.category10();
            //

            formatPercent = d3.format("");

              var xAxis = d3.svg.axis()
                  .scale(x)
                  .tickFormat(function(d) { return d + "%"; })
                  .orient("bottom").tickSize(-plotHeight);


              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  ;


    // var color = d3.scale.category10();

    d3.csv("Water_Use_Breakdown_Chart.csv", accessor, function(error, data) {
        if (error) throw error;


    data.sort(comparator);

        // var zips = d3.nest()
        //         .key(function(d) {return d["Location 1"]})
        //         .entries(data);
    var users = data.map(function(d){return d.user});
        x.domain([50,0]);
        y.domain(users);


        plot.append("g")
          .attr("class", "x_axis")
          .attr("class", "axis")
          .attr("transform", "translate(0," + plotHeight + ")")
          .call(xAxis)
        //   .append("text")
        //     // .attr("transform", "rotate(-90)")
        //     .attr("y", 6)
        //     .attr("dy", ".71em")
        //     .style("text-anchor", "end")
        //     .text("Percentage of Water Use (%)");

      plot.append("g")
          .attr("class", "y_axis")
          .call(yAxis);


    d3.selectAll(".y_axis text")
        .attr("transform","rotate(-25)");
    // console.log(zips);


        var node = plot.selectAll("rect")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("id",function(d){return (d.user).slice(0,1)})
          .attr("x", 0)
          .attr("width", function(d) { return  x(d.value)})
          .attr("y", function(d) { return y(d.user); })
          .attr("height", y.rangeBand());
        //   .style("fill", function(d) { return color(d.sum); });

    plot.append("text")
        .attr("transform", "translate(180,230)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", ".5em")
        .text("Often Related to Sewer Main Repair(?)");



    });
}


function drawLine(){
    var width = d3.select("div#title2").node().getBoundingClientRect().width - 10,
        height = 350;

        var voronoi = d3.voronoi();

    var svg = d3.select("div#title2").append("svg")
        .attr({
            width : width,
            height : height
        });

    var plotHeight = height - 30,
        plotWidth = width - 150

        var plot = svg.append("g")
            .attr({
                width : plotWidth,
                height : plotWidth
            })
            .attr("transform", "translate(" + 130 + "," + 10 + ")");

            var x = d3.time.scale()
            .range([0, plotWidth]);

              var y = d3.scale.linear()
                  .range([plotHeight, 0]);

            //   var color = d3.scale.category10();
            //
              var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");


              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                .tickSize(-plotWidth);


                  var line = d3.svg.line()
                    .interpolate("basis")
                      .x(function(d) { return x(d.month); })
                      .y(function(d) { return y(d.total); });



    // var color = d3.scale.category10();

    d3.csv("monthTotal.csv", accessor, function(error, data) {
        if (error) throw error;
        // console.log(data);

    var months = d3.extent(data, function(d) { return d.month; });

        x.domain(months);

    var totals = d3.extent(data, function(d) { return d.total; });
        // console.log(totals)
    totals[0] = totals[0] - 2000;
    totals[1] = totals[1] + 2000;

        y.domain(totals);


        plot.append("g")
          .attr("class", "x_axis")
          .attr("class", "axis")
          .attr("transform", "translate(0," + plotHeight + ")")
          .call(xAxis)


      plot.append("g")
          .attr("class", "y-axis axis")
          .call(yAxis)
            .append("text")
              // .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .attr("dx", "7em")
              .style("text-anchor", "end")
              .text("Water Used (Hundred Cubic Feet)");


    d3.selectAll(".x_axis text")
        .attr("transform","rotate(-25)");



        var node = plot.append("path")
          .datum(data)
        .attr("class","line")
        .attr("d",line);
        //   .style("fill", function(d) { return color(d.sum); });





    });

    function accessor(d) {
        var format = d3.time.format("%b_%Y");
        d.total = (+d.total)
        d.month = format.parse(d.month)
        return d;
    }

    // function totaLaccessor(d){
    //         var row = {};
    //         row.sum = 0;
    //         row.popTotal = +d["Total"]
    //         row.loc = d["zip"]
    //         row.sum += (+d["FY 5/6"]) + (+d["FY 6/7"]) + (+d["FY 7/8"]) + (+d["FY 8/9"])
    //                     + (+d["FY 9/10"]) + (+d["FY 10/11"]) + (+d["FY 11/12"]) (+d["FY 12/13"]);
    //         return row;
    // }

    function comparator(a, b) {
      return b.value - a.value;
    }

}



function drawWaterUse(){






var width = (d3.select("div#map").node().getBoundingClientRect().width - 100)/2,
    height = 400;


var quantize = d3.scale.threshold()
    .domain([10,20,30,40,50,60,70,80,150])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var color = d3.scale.threshold()
    .domain([0,10,20,30,40,50,60,70,150])
    .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'])

var projection2 = d3.geo.albersUsa()
    .scale(25500)
    .translate([width + 7700, -950]);

var path = d3.geo.path()
    .projection(projection2);


var svg = d3.select("div#map").append("svg")
    .attr("width", width)
    .attr("height", height);


var rateById = d3.map();
var rateByRegion = d3.map();



  queue()
      .defer(d3.json, "Zip.geojson")
      .defer(d3.csv, "WaterWithPop.csv", function(d) {
          rateByRegion.set(d.zip, d.region)
          rateById.set(d.zip, waterAccessor(d))
      })
      .await(draw2);

// console.log(rateByZip);


function draw2(error,data1) {

    var paths =  svg.append("g")
        .attr("class", "counties")
      .selectAll("path")
        .data(data1.features)
      .enter().append("path")
      .attr("class", function(d) { return "z" + rateByRegion.get(d.properties.geoid10) + " " + quantize(rateById.get(d.properties.geoid10)); })
        .attr("d", path);


        var legend = d3.legend.color()
            .shape("path", d3.svg.symbol().type("circle").size(150)())
              .shapePadding(10)
              .scale(color);

          svg.append("g")
               .attr("class", "legend")
               .attr("transform", "translate(30,170)");


       svg.select(".legend")
         .call(legend);


    }

}


function drawSalaryMap(){



var width = d3.select("div#map2").node().getBoundingClientRect().width - 100,
    height = 400;


var quantize = d3.scale.quantize()
    .domain([0,150000])
    .range(d3.range(9).map(function(i) { return "q" + i + "-17"; }));

var color = d3.scale.quantize()
    .domain([0,150000])
    .range(['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']);


var projection2 = d3.geo.albersUsa()
    .scale(25500)
    .translate([width + 7700, -950]);

var path = d3.geo.path()
    .projection(projection2);


var svg = d3.select("div#map2").append("svg")
    .attr("width", width)
    .attr("height", height);



  queue()
      .defer(d3.json, "Zip.geojson")
      .defer(d3.csv, "IncomeData/BestMedian.csv", function(d) { rateByZip.set(d.zip, d.median) })
      .await(draw2);

// console.log(rateByZip,"That fresh");


function draw2(error,data1,data2) {
    // data2.forEach(function(s){
    //     var sorted = s.sort(comparatorMap);
    //
    //     // if(sorted.name=="90049") console.log(sorted,"RIGHT HERE");
    //     console.log(sorted);
    //     rateByZip.set(s.name, sorted[8][1]);
    // })

    // console.log(rateByZip.get("90049"),"trueheat");

    var paths =  svg.append("g")
        .attr("class", "counties")
      .selectAll("path")
        .data(data1.features)
      .enter().append("path")
      .attr("class", function(d) { return "s" + (d.properties.geoid10) + " " + quantize(rateByZip.get(d.properties.geoid10)); })
        .attr("d", path);

    var legend = d3.legend.color()
        .shape("path", d3.svg.symbol().type("circle").size(150)())
        .labelFormat(d3.format(",f"))
          .shapePadding(10)
          .scale(color);

      svg.append("g")
           .attr("class", "legend")
           .attr("transform", "translate(30,170)");


   svg.select(".legend")
     .call(legend);



// Uses the rate by zip so must be called after zips made
        drawSalaryBar();
    }

}
//THIS NEEDS TO CALCULATE MEDIAN BUT PAUSE...........?
function accessorMap(d){

var all = [[+d.b1,1],[+d.b2,2],
    [+d.b3,3],[+d.b4,4],
    [+d.b5,5],[+d.b6,6],
    [+d.b7,7],[+d.b8,8],
    [+d.b9,9],[+d.b10,10],
    [+d.b11,11],[+d.b12,12],
    [+d.b13,13],[+d.b14,14],
    [+d.b15,15],[+d.b16,17],
                [+d.b17,17]];

    all.name = d.zip;

// if(all.name=="90049") console.log(all);
// row.vals = all;
// console.log(all.sort(comparator));
//     rateByZip.set(d.name, all)

// console.log(all);
    return all;
    // return (+d["B19001017"]) + (+d["B19001016"]) + (+d["B19001015"]) + (+d["B19001014"]);
}

function comparatorMap(a,b){
    // if(isNaN(a[0])) a[0] = 0;
    // if(isNaN(b[0])) b[0] = 0;
    // console.log(a,b)
    var val = a[0] - b[0];
    if (val > 0){
        return 1;
    }else return -1;
}

function waterAccessor(d) {
    var temp = (+d["05/06"]) + (+d["06/07"]) + (+d["07/08"]) + (+d["08/09"]) + (+d["09/10"]) + (+d["10/11"]) + (+d["11/12"]);
    return (temp/7);
}



function waterAccessorBar(d) {

    row = {};
    var temp = (+d["05/06"]) + (+d["06/07"]) + (+d["07/08"]) + (+d["08/09"]) + (+d["09/10"]) + (+d["10/11"]) + (+d["11/12"]);
    row.value = temp/7;
    row.zip = d.zip;
    row.region = d.region;
    // if(row.value > 50)
    // if(row.value > 50)
    return row;
}

function drawWaterBar() {
    var width = d3.select("div#waterBar").node().getBoundingClientRect().width - 10,
        height = 350;

    var svg = d3.select("div#waterBar").append("svg")
        .attr({
            width : width,
            height : height
        });

    var format = d3.format("%");

        var color = d3.scale.ordinal()
            .domain([0, 300])
            .range(['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']);;

    var plotHeight = height - 30,
        plotWidth = width - 150

        var plot = svg.append("g")
            .attr({
                width : plotWidth,
                height : plotWidth
            })
            .attr("transform", "translate(" + 130 + "," + 10 + ")");

            var y = d3.scale.ordinal()
            .rangeRoundBands([0, plotHeight], .1);

              var x = d3.scale.linear()
                  .range([plotWidth, 0]);

              var xAxis = d3.svg.axis()
                  .scale(x)
                //   .tickFormat(function(d) { return d + "%"; })
                  .orient("bottom").tickSize(-plotHeight);


              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");


    // var color = d3.scale.category10();

    d3.csv("WaterWithPop.csv", waterAccessorBar, function(error, data) {
        if (error) throw error;


    data.sort(comparator);

        var zips = d3.nest()
                .key(function(d) {return d.region})
                .rollup(function(d){
                    return d3.mean(d,function(val){return val.value })  })
                .entries(data);

                console.log(zips,"zippin");



        var users = ["S","H","N","W","E"]

        x.domain([60,0]);
        y.domain(users);

        console.log(users)


        plot.append("g")
          .attr("class", "x_axis")
          .attr("class", "axis")
          .attr("transform", "translate(0," + plotHeight + ")")
          .call(xAxis)
        //   .append("text")
        //     // .attr("transform", "rotate(-90)")
        //     .attr("y", 6)
        //     .attr("dy", ".71em")
        //     .style("text-anchor", "end")
        //     .text("Percentage of Water Use (%)");

      plot.append("g")
          .attr("class", "y_axis")
          .call(yAxis);


    d3.selectAll(".y_axis text")
        .attr("transform","rotate(-25)");
    // console.log(zips);


        var node = plot.selectAll("rect")
          .data(zips)
        .enter().append("rect")
          .attr("class",function(d){return "bar z" + (d.key)})
          .attr("x", 0)
          .attr("width", function(d) {return  x(d.values)})
          .attr("y", function(d) { return y(d.key); })
          .attr("height", y.rangeBand())
          .on("mouseover",function(d){
              var me = d3.select(this).attr("class");
              var zip = me.substr(me.indexOf(' ')+1);
              var selects = d3.selectAll("path." + zip);

              selects
                .classed("selected",true)
                .classed("floating",true);

                selects.moveToFront();
          }).on("mouseout",function(d){
              var me = d3.select(this).attr("class");

              var zip = me.substr(me.indexOf(' ')+1);
              var selects = d3.selectAll("path." + zip)
                .classed("selected",false)
                .classed("floating",false);
          });
        //   .style("fill", function(d) { return color(d.sum); });





    });
}

function drawSalaryBar() {
    // console.log(rateByZip.keys(),"MEGA HEAT");
    var width = d3.select("div#salaryBar").node().getBoundingClientRect().width - 10,
        height = 350;

    var svg = d3.select("div#salaryBar").append("svg")
        .attr({
            width : width,
            height : height
        });

    var format = d3.format("%");

        var color = d3.scale.ordinal()
            .domain([0, 20])
            .range(['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']);;

    var plotHeight = height - 30,
        plotWidth = width - 150

        var plot = svg.append("g")
            .attr({
                width : plotWidth,
                height : plotWidth
            })
            .attr("transform", "translate(" + 130 + "," + 10 + ")");

            var y = d3.scale.ordinal()
            .rangeRoundBands([0, plotHeight], .1);

              var x = d3.scale.linear()
                  .range([plotWidth, 0]);

              var xAxis = d3.svg.axis()
                  .scale(x)
                //   .tickFormat(function(d) { return d + "%"; })
                  .orient("bottom").tickSize(-plotHeight);


              var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  ;


    // var color = d3.scale.category10();

    d3.csv("IncomeData/BestMedian.csv", salaryBarAccessor, function(error, data) {
        if (error) throw error;

        var zips = d3.nest()
                .key(function(d) {return d.region})
                .rollup(function(d){
                    return d3.mean(d,function(s){return s.median})
                })
                .entries(data);


                console.log(zips,"heaters")



    // var users = data.map(function(d){return (d.zip)});
    //
    // users.sort(function(a,b){ return rateByZip.get(b) - rateByZip.get(a) })

    var users = ["S","E","H","N","W"];




        x.domain([200000,0]);
        y.domain(users);

// console.log(rateByZip.get("90043"));

        plot.append("g")
          .attr("class", "x_axis")
          .attr("class", "axis")
          .attr("transform", "translate(0," + plotHeight + ")")
          .call(xAxis)
        //   .append("text")
        //     // .attr("transform", "rotate(-90)")
        //     .attr("y", 6)
        //     .attr("dy", ".71em")
        //     .style("text-anchor", "end")
        //     .text("Percentage of Water Use (%)");

      plot.append("g")
          .attr("class", "y_axis")
          .call(yAxis);


    d3.selectAll(".y_axis text")
        .attr("transform","rotate(-25)");
    // console.log(zips);

    console.log(rateByZip,"heat zip fire");
        var node = plot.selectAll("rect")
          .data(zips)
        .enter().append("rect")
          .attr("class",function(d){return "bar s" + (d.zip)})
          .attr("x", 0)
          .attr("width", function(d) {
              return  x(d.values)})
          .attr("y", function(d) { return y(d.key); })
          .attr("height", y.rangeBand())
          .on("mouseover",function(d){
              var me = d3.select(this).attr("class");
              var zip = me.substr(me.indexOf(' ')+1);
              var selected = d3.selectAll("path." + zip);

              selected.moveToFront();
              selected
                .classed("selected",true);
            //   console.log();
          }).on("mouseout",function(d){
              var me = d3.select(this).attr("class");
              var zip = me.substr(me.indexOf(' ')+1);
              var selected = d3.selectAll("path." + zip)
                .classed("selected",false);


          });
        //   .style("fill", function(d) { return color(d.sum); });





    });
}

function salaryBarAccessor(d){
    // var rate = 90000;
    // // var rate = 30000;
    // // var rate = 100000;
    // if(rateByZip.get(d.zip) > rate)
    return d;

}

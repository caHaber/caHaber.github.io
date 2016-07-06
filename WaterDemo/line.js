function drawLine(){
    var width = 600,
        height = 350;

    var svg = d3.select("body").append("svg")
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
                    .interpolate("linear")
                      .x(function(d) { return x(d.month); })
                      .y(function(d) { return y(d.total); });



    // var color = d3.scale.category10();

    d3.csv("monthTotal.csv", accessor, function(error, data) {
        if (error) throw error;
        console.log(data);

    // var months = data.map(function(d){return d.month});
    var months = d3.extent(data, function(d) { return d.month; });


    // years = years.slice(0,years.length-1);
    console.log(months)
        x.domain(months);

    var totals = d3.extent(data, function(d) { return d.total; });
        console.log(totals)
    totals[0] = totals[0] - 2000;
    totals[1] = totals[1] + 2000;

        y.domain(totals);

    //data.sort(comparator);

        // var zips = d3.nest()
        //         .key(function(d) {return d["Location 1"]})
        //         .entries(data);


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

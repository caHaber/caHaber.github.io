
//LOADING DATA CORRECT ORDER

function loadFRL() {
  d3.csv("FullEducationData/Filtered_Data_2011_2012.csv", schoolAccessor,


  function(data) {
    


    data = data.filter(function(d){
      if(isNaN(d.MathPercentTotal)){
          return false;
      } else if (isNaN(d.ReadingPercentTotal)){
          return false;
      }
      return true;
  });
    // console.log(total_frl,"FRL");
    // console.log(total_all,"all");

    var dataset = d3.nest()
        //   .key(function(d) {return d["School"]})
          .key(function(d) {return d["Grade"]})
          .entries(data);

  var barDataset = d3.nest()
        .key(function(d) {return d["Ethnicity"]})
        .rollup(function(values) {
            var percents = [];
            percents[0] = d3.mean(values, function(d) {
                return (d.MathPercentTotal) ;
            })
            percents[1] = d3.mean(values, function(d) {
                return (d.ReadingPercentTotal) ;
            })

            percents[3] = values;

          if (!percents[0].isNaN){
              return percents
          }


        })
    .entries(data);


    // console.log(dataset,"Gradenest");

    // loadDemos();

    drawBar(barDataset);
    drawPointScatter(data);
    drawBees(d3.merge([dataset[0].values,dataset[1].values]),focus, "Kindergarden & 1st");
    drawBees(d3.merge([dataset[2].values,dataset[3].values]),focus2, "2nd & 3rd");
    drawBees(d3.merge([dataset[4].values,dataset[5].values]),focus3, "4th & 5th");
    drawBees(d3.merge([dataset[6].values,dataset[7].values],dataset[8].values),focus4, "6th, 7th & 8th");

    });

}


function loadDemos() {
  d3.csv("FullEducationData/Filtered_Data_2012_2013.csv", schoolAccessor, function(data) {

      data = data.filter(function(d){
        if(isNaN(d.MathPercentTotal)){
            return false;
        } else if (isNaN(d.ReadingPercentTotal)){
            return false;
        }
        // console.log(d.Grade);
        return true;
    });


            var dataset = d3.nest()
                //   .key(function(d) {return d["School"]})
                  .key(function(d) {return d["Ethnicity"]})
                  .rollup(function(values) {
                      var percents = [];
                      percents[0] = d3.mean(values, function(d) {
                          return (d.MathPercentTotal) ;
                      })
                      percents[1] = d3.mean(values, function(d) {
                          return (d.ReadingPercentTotal) ;
                      })

                      percents[3] = values;

                    if (!percents[0].isNaN){
                        return percents
                    }


                  })
              .entries(data);


              // console.log(dataset, "2013-14 DEMOs");
            //   barData = dataset;

              console.log("2012-2013",dataset);
            //   drawBar(dataset)
            //   drawScatter(dataset)



  });
}

var schoolAccessor = function(d){


    d.Grade = +d.Grade;
    d.ReadingPercentTotal = +d.ReadingPercentTotal;
    d.MathPercentTotal = +d.MathPercentTotal;

    if(d["HomeLanguage"] === "NA"){
        d["HomeLanguage"] = "English"
    }

    if(d["Ethnicity"] === "M"){
            d["Ethnicity"] = "Other";
    }else if (d["Ethnicity"] === "I") {
        d["Ethnicity"] = "Other";
    }else if (d["Ethnicity"] === "P"){
        d["Ethnicity"] = "Other";
    }


    return d;
}






var topSchools = function (d){

    if(d["SchoolName"] !== "Garfield High School"){

        if(d["SchoolName"] !== "Washington Middle School"){

            if(d["SchoolName"] !== "Bailey Gatzert Elementary"){

                return
            }
        }
    }


        return d;
}

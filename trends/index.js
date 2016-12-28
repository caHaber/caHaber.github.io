var googleTrends = require('google-trends-api');

var options = {
    geo: 'country code or name',
    date: 'yyyymm',
    keywords: ['some', 'list', 'of', 'keywords'],
    category: 'some category',
    timePeriod: {
        type: enumerated string 'hour', 'day', 'month', or 'year'
        value: number
    }
}

googleTrends.apiMethod(options)
.then(function(results){
    console.log("Here are your google trend results!", results);
})
.catch(function(err){
    console.log("there was an error :(", err);
});

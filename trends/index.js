var googleTrends = require('google-trends-api');


googleTrends.hotTrends('US')
.then(function(results){
    console.log(results)
    // console.log("Here are your google trend results!", results);
})
.catch(function(err){
    console.log("there was an error :(", err);
});

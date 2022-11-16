const express = require("express");
const https = require("https");
const ejs = require('ejs');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", function(req, res) {

    res.sendFile(__dirname + "/index.html");
    res.render('home');
})

app.post("/", function (req, res){
    const appid = "794ee95e63c5a32aaf88cd813fa2e425";
    const units = "metric";
    const q = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + q +"&appid=" + appid + "&units=metric";


    https.get(url, function (resp){
        // console.log(resp.statusCode);  // resp (response contains all the things that it gets from the external server)
        
        resp.on("data", function(data){
            const webData = JSON.parse(data);   // data received is in hexadecimal string format so we have to convert it into js object
            // console.log(webData.main.temp + "\n" + webData.weather[0].description);
            
            var imge = webData.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + imge + "@2x.png";


            res.write("<h1>The Temperature in " + q + " is " + webData.main.temp + " degree Celcius.</h1>" + "<p>The weather is currently " + webData.weather[0].description + ". </p>");

            res.write("<img src = " + iconURL + ">");
            res.send();
        })
    })
})

app.listen(PORT, () => {
    console.log("app is running on port %d", PORT);
});
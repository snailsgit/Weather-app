//ADD YOUR API 

const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");

const app=express();
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

const ejs = require("ejs");
app.set('view engine', 'ejs');

app.get("/",function(req,res){

    res.sendFile(__dirname+"/search.html");
     
});

function timeformats(unix){
    var date=new Date(unix*1000);

    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();
    if(hour>=12){hour=hour-12;ap='PM'}else{ap='AM'} 
    if(minute<10){minute='0'+minute};
    if(second<10){second='0'+second};
    var time=hour+" : "+minute+" : "+second+" "+ap;

    return time;
}



app.post("/",function(req,res){
    var query=req.body.cityName;
    const apikey="###yourapikey";
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+unit;
    https.get(url,function(response){
        
        response.on("data",function(data){

            var date=new Date();
            var weekday=date.getDay();
            var year=date.getYear();
            var month=date.getMonth();
            var day=date.getDate();
            var days=new Array ('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday' );
            var months=new Array('January','February','March','April','May','June','July','August','September','October','November','December');
            var monthname=months[month];
            var dayname=days[weekday];
            if(year<1000){year=year+1900}; 

            var todaydate=monthname+" "+day+", "+year;


            
            const weather_data=JSON.parse(data);
            const temp=weather_data.main.temp;
            const tempfeellike=weather_data.main.feels_like;
            const weatherdes=weather_data.weather[0].description;
            const icon=weather_data.weather[0].icon;
            query+=" , "+weather_data.sys.country;
            const temp_min=weather_data.main.temp_min;
            const temp_max=weather_data.main.temp_max;
            var sunrise=weather_data.sys.sunrise;
            var sunset=weather_data.sys.sunset;
;
           
            const link="http://openweathermap.org/img/wn/"+icon+"@2x.png"
            res.render("weather-info",{temp:temp,city:query,iconimg:link,todaydate:todaydate,
                dayname:dayname,weatherdes:weatherdes,tempfeellike:tempfeellike,
                temp_min:temp_min,temp_max:temp_max
            })
            
            
        });
          
    });
});

app.listen(process.env.PORT || 5000,function(){
    
})
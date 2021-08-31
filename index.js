const express = require('express');
const Datastore = require('nedb-promises');
const fetch = require('node-fetch');

const app = express();
var cors = require('cors');
const port = process.env.PORT;



const database = new Datastore({filename: '.data/database', autoload: true })
//database.loadDatabase();
 //database.insert({testinit : "testinit"});
const metabase = new Datastore('.data/metabase');
//metabase.loadDatabase();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://www.geoguessr.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// enable pre-flight request for POST request
app.options('/api', cors()) 

app.listen(port, () => console.log('listening at ' + port));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', cors(), function (req, res, next) {

  const data = req.body;
  //database.insert(data);
  sendtoDatabase(data);
  //console.log("post : " + JSON.stringify(data));
  res.json(data);



});



app.get('/getselect', async (request, response) => {
    //console.log(request.query.id);
    var dbResponse = await database.find({nickname : request.query.id});
  //console.log(dbResponse.length);
    
    var listMap = [];
    var listType= [];
    var listTime = [];
    for (var i = 0; i < dbResponse.length; i++){
        var row = dbResponse[i];
        if (!listMap.includes(row.mapName)) {
            listMap.push(row.mapName);
        }
        if (!listType.includes(row.gameType)) {
            listType.push(row.gameType);
        }
        if (!listTime.includes(row.timeLimit)) {
            listTime.push(row.timeLimit);
        }

    }
    var result = {lMap : listMap, lType : listType, lTime : listTime};
//console.log(result);
  response.json(result);
  

});


app.get('/getdata', async (request, response) => {
    /*console.log(request.query.id);
    console.log(request.query.type);
    console.log(request.query.map);
    console.log(request.query.time);*/

    var dataQuery = {nickname : request.query.id};

    if (request.query.type != "all") {
        dataQuery.gameType = request.query.type;
    }
    if (request.query.map != "all") {
        dataQuery.mapName= request.query.map;
    }
    if (request.query.time != "all") {
        dataQuery.timeLimit = parseInt(request.query.time);
    }

    console.log(dataQuery);
    var dbResponse = await database.find(dataQuery).sort({roundScore: -1, time : 1});

      /*for (var i = 0; i < dbResponse.length; i++){
    console.log("score : " + dbResponse[i].roundScore +" time " + dbResponse[i].time);
      }*/
  
  //list.sort((a, b) => (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
  
  var countryStats = getCountryStats(dbResponse);
  
  var geodata = createGeoJSON(countryStats);
  
  console.log("geodata length :" + geodata.features.length);
  for (var i = 0; i < geodata.features.length; i++) {
  console.log(geodata.features[i].properties.ADMIN + geodata.features[i].properties.averageScore);
  }
  
  var dataObject = {list : dbResponse, countryStats : countryStats, geoData : geodata};
  
      response.json(dataObject);
      
});

function createGeoJSON(data) {
  var fs = require('fs');
var worldCountries = JSON.parse(fs.readFileSync('ready.geojson', 'utf8'));

  for (var i = 0; i < worldCountries.features.length; i++) {
  if (data.hasOwnProperty(worldCountries.features[i].properties.ADMIN)) {
  worldCountries.features[i].properties.averageScore = data[worldCountries.features[i].properties.ADMIN].meanScore;
   worldCountries.features[i].properties.averageTime = data[worldCountries.features[i].properties.ADMIN].meanTime;
    worldCountries.features[i].properties.count = data[worldCountries.features[i].properties.ADMIN].count;
    
  console.log("country " + worldCountries.features[i].properties.ADMIN + "score " + worldCountries.features[i].properties.averageScore );
  }
  }
    return worldCountries;
  
}
  
  



function getCountryStats(data) {
  
  var cStats = {};
       for (var i = 0; i < data.length; i++) {
         cStats[data[i].country] ={count : 0, distanceInMeters : 0, time : 0, score : 0};
       }
         for (var i = 0; i < data.length; i++) {
         cStats[data[i].country].count = cStats[data[i].country].count + 1;
           cStats[data[i].country].distanceInMeters= cStats[data[i].country].distanceInMeters + data[i].distanceInMeters;
           cStats[data[i].country].time = cStats[data[i].country].time + data[i].time;
           cStats[data[i].country].score = cStats[data[i].country].score + data[i].roundScore;
       }
  
  //console.log(JSON.stringify(cStats));
  var realStats = {};
  
  for(var propertyName in cStats) {
    realStats[propertyName] = {count : cStats[propertyName].count, meanDistanceInMeters : cStats[propertyName].distanceInMeters / cStats[propertyName].count, meanTime : cStats[propertyName].time / cStats[propertyName].count, meanScore : cStats[propertyName].score / cStats[propertyName].count}
}

  //console.log(JSON.stringify(realStats));
  return realStats;
  
  
}


async function sendtoDatabase(data) {
    //console.log("sendtodatabase");
    if (!data){
        return;
    }

    var maxDate = 0;
    var maxDateObject = {};
    var apiCountObject = {};
    var insertData = [];
    var apiCount = 0;
    var totalApiCount = 0;

    //get nickname
    var nick = data[0].nickname;
    console.log("post nickname :" + nick);

    //get max date of incoming data
    var newMaxDate = 0;
    for (var i = 0; i < data.length; i++){
      var dataDate = new Date(data[i].date);
        if (dataDate > newMaxDate) {
            newMaxDate = dataDate;
        }

    }
  console.log("post newmaxdate:" + newMaxDate);
  //metabase.insert({test : "testinsert"});

    //if no user exists, insert one
  var userExist = await userExists(nick);
  if (!userExist) {
    var baseDate = new Date('2000-01-01T00:00:00');
    metabase.insert({nickname : nick, maxDate : baseDate})
    
  }
  //user and his max date,
  maxDateObject = await getMaxDate(nick);
  
    console.log("maxDateObject " + JSON.stringify(maxDateObject));

  //if no date exists, create one
    var today = new Date();
    var todayDay = today.getDate();
    var todayMonth = today.getMonth();
    var todayYear = today.getFullYear();
    var queryToday = {day : todayDay, month : todayMonth, year : todayYear}
    var dateExist = await dateExists(queryToday);
  if (!dateExist) {
    metabase.insert({day : todayDay, month : todayMonth, year : todayYear, apiCalls : 0})
    
  }

  apiCountObject = await getApiCount(queryToday);
     
  console.log("ApiCountObject " + JSON.stringify(apiCountObject));

     //add only the newest entries
  console.log("data length : " + data.length);
  
     for (var i = 0; i < data.length; i++) {

       var dataDate =new Date(data[i].date);
       var mDate =new Date(maxDateObject.maxDate);
        /*console.log(dataDate);
       console.log(mDate);
       console.log("diff");
       console.log(dataDate - mDate);*/
        if (dataDate - mDate > 1) {
            insertData.push(data[i]);
        }
    }
  console.log("insert data length" + insertData.length);
  
    //check for daily limit call to reverse geocode api
    totalApiCount = insertData.length + apiCountObject.apiCount;
    if ( totalApiCount > 2500) {
      console.log("too many api calls for today.");
        return ;
    }
  console.log("post totalapicount :" + totalApiCount);
  
    //reverse geocoding and insrting data into database
  
  if (insertData.length !== 0) {
  reverseGeocode(insertData);
  
  
  //update metadata
  metabase.update({ _id: apiCountObject.id }, {day : todayDay, month : todayMonth, year : todayYear, apiCalls : totalApiCount}, {}, (err, num) => {});
  console.log("maxdateobject id : " + maxDateObject.id);
  console.log(nick);
  console.log(newMaxDate);
  metabase.update({ _id: maxDateObject.id }, { nickname : nick, maxDate : newMaxDate }, {}, (err, num) => {console.log(err);});
  }  
    
}

async function reverseGeocode(data) {
  
  
  for (var i = 0; i < data.length; i++){
      //for (var i = 0; i < 3; i++){
        //every 25 seconds, process one line : send a request for geocoding and write to database
        setTimeout(reverseGeo, i*250,data[i]);
    }
 
  
}

async function reverseGeo(dataLine) {
  var newLine = JSON.parse(JSON.stringify(dataLine));
  var requestOptions = {method: 'GET',};
      var url = "https://api.geoapify.com/v1/geocode/reverse?lat=" + dataLine.solutionLat + "&lon="+ dataLine.solutionLng +"&apiKey=" + process.env.geoapifyKey;
      var response = await fetch(url, requestOptions);
      const dataReturned = await response.json();
      //console.log (url + "\n" + JSON.stringify(dataReturned));
  //console.log(JSON.stringify(dataReturned.features[0].properties.formatted));
  //console.log(dataReturned.features[0].properties.formatted);
  //cat .data/metabase
  console.log(dataReturned.features[0].properties.country);
      newLine.address = dataReturned.features[0].properties.formatted;
      newLine["country"] = dataReturned.features[0].properties.country;
  console.log("new Line :" + JSON.stringify(newLine));
  database.insert(newLine);
  
}

async function userExists(user) {
   const record = await metabase.findOne({nickname : user});
  //console.log(record);
  if(record) {
    return true;
    
  }
  return false;
  
}


async function dateExists(query) {
    
   const record = await metabase.findOne(query);
  //console.log(record);
  if(record) {
    return true;   
  }
  return false;
}


async function getMaxDate(user) {
  
    //get user max date and id
  var record = await metabase.find({nickname : user});
      var response = {};
    response.maxDate = record[0].maxDate;
    response.id = record[0]._id;
    return response;
  
  }



async function getApiCount(query) {
     var record = await metabase.find(query);
  console.log("apicount record : ");
  console.log(record);
        //console.log("update datameta api number");
        //metabase.update({ _id: dataMeta[0]._id }, { apiCalls: apiNumber }, {}, (err, num) => {});         
       var response = {};
       response.apiCount = record[0].apiCalls;
       response.id = record[0]._id;    
       return response;    
    
}


  
  

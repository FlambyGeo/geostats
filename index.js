const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
    //console.log(request);
    //console.log(request.body);
  const data = request.body;
  //console.log(data);
  //const timestamp = Date.now();
  //data.timestamp = timestamp;
  database.insert(data);
  //database.insert(data[0]);
  console.log(data);
  //response.json(data);



});



app.get('/getselect', (request, response) => {
    console.log(request.query.id);
    //var dbResponse = database.find({nickname : request.query.id});
    var dbResponse;
    database.find({nickname : request.query.id}, (err, data) => {
        if (err) {
          response.end();
          return;
        }


      //console.log(data);
    var listMap = [];
    var listType= [];
    var listTime = [];
    for (var i = 0; i < data.length; i++){
        var row = data[0]
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

    console.log(result);
      response.json(result);
      
    });
});


app.get('/getdata', (request, response) => {
    console.log(request.query.id);
    console.log(request.query.type);
    console.log(request.query.map);
    console.log(request.query.time);

    var dataQuery = {nickname : request.query.id};

    if (request.query.type != "all") {
        dataQuery.gameType = request.query.type;
    }
    if (request.query.map != "all") {
        dataQuery.mapName= request.query.map;
    }
    if (request.query.time != "all") {
        dataQuery.timeLimit = request.query.time;
    }


    database.find(dataQuery, (err, data) => {
        if (err) {
          response.end();
          return;
        }

    console.log(data);
      response.json(data);
      
    });
});
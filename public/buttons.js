function setup () {
    
 /*   const pButton = document.getElementById('postButton');
  pButton.addEventListener('click', async event => {
 // var data = [["Flamby",1630105112477],
 // ["nickname","mapName","date","gameType","timeLimit","totalScore","totalTime","totalDistanceInMeters","Round Score","Round Distance","Round Time","Player Lat","Player Lng","Solution Lat","Solution Lng"],
 //                                                   ["Flamby","A Diverse World","2021-08-23T20:38:10.000Z","Normal",300,"19350",1500,2690672.4557209197,3876,471809.766746063,300,-26.25816750811283,31.872754474473425,-29.51453666609916,28.79425848548701],
 //                                                   ["Flamby","A Diverse World","2021-08-23T20:38:10.000Z","Normal",300,"19350",1500,2690672.4557209197,4920,30023.8399868027,300,15.008839600371804,-12.662551973440259,14.83019321997093,-12.45302519455096],["Flamby","A Diverse World","2021-08-23T20:38:10.000Z","Normal",300,"19350",1500,2690672.4557209197,4434,222514.0397549269,300,35.81753292501609,10.63019154719268,33.8616028203685,10.11492753324454],["Flamby","A Diverse World","2021-08-23T20:38:10.000Z","Normal",300,"19350",1500,2690672.4557209197,2218,1506746.848410232,300,2.5050025987794986,102.38617840649249,5.267770085392453,115.684064715029],["Flamby","A Diverse World","2021-08-23T20:38:10.000Z","Normal",300,"19350",1500,2690672.4557209197,3902,459577.9608228951,300,-24.796751773293014,-65.39242413658945,-24.52423727023616,-60.854239812509945],["Flamby","A Diverse World","2021-08-23T20:04:03.000Z","Normal",300,"23163",1500,729577.6280321056,4220,314268.4654581161,300,63.56606949135793,26.568344338888323,60.78352454535638,27.630703670697358],["Flamby","A Diverse World","2021-08-23T20:04:03.000Z","Normal",300,"23163",1500,729577.6280321056,4993,2767.7106323355,300,53.73772578203998,-0.1362627370225482,53.71400374088145,-0.14900185371050156],["Flamby","A Diverse World","2021-08-23T20:04:03.000Z","Normal",300,"23163",1500,729577.6280321056,4354,256471.0643130568,300,0.7445487312341754,37.54270439760529,-0.1991371131052828,35.4380432920757],["Flamby","A Diverse World","2021-08-23T20:04:03.000Z","Normal",300,"23163",1500,729577.6280321056,4999,474.5581104467,300,47.22514606416245,2.064307301832514,47.22399320997018,2.0703579340200804],["Flamby","A Diverse World","2021-08-23T20:04:03.000Z","Normal",300,"23163",1500,729577.6280321056,4597,155595.8295181505,300,-26.716772543831244,25.883738918210554,-25.3427548820638,26.17847696447518],["Flamby","A Diverse World","2021-08-23T19:28:00.000Z","Normal",300,"23896",1358,459868.35476761905,5000,1.7251400225,158,55.164306365159156,10.413562858112073,55.16429472703317,10.41358081847568],["Flamby","A Diverse World","2021-08-23T19:28:00.000Z","Normal",300,"23896",1358,459868.35476761905,4989,4198.0859829181,300,39.570449845186104,-75.46706935388914,39.54099526809908,-75.49770220565519],["Flamby","A Diverse World","2021-08-23T19:28:00.000Z","Normal",300,"23896",1358,459868.35476761905,4996,1585.6351137055,300,37.10839572813163,25.38407587901628,37.09503979220491,25.39034061561881],["Flamby","A Diverse World","2021-08-23T19:28:00.000Z","Normal",300,"23896",1358,459868.35476761905,3920,450913.8558582534,300,-9.46929628607784,-41.71489735187151,-6.885287851247092,-38.5572399925062],["Flamby","A Diverse World","2021-08-23T19:28:00.000Z","Normal",300,"23896",1358,459868.35476761905,4991,3169.0526727196,300,23.60079648818648,120.26101547935752,23.62895427772959,120.2562099348093]];
  var data2 = [{nickname : "Flamby", mapName : "A Diverse World", date:"2021-08-23T20:38:10.000Z", gameType : "Normal",timeLimit : 300,totalScore : 19350,totalTime : 1500,totalDistanceInMeters : 2690672.4557209197,roundScore : 3876,roundDistance : 471809.766746063,roundTime : 300,playerLat : -26.25816750811283, playerLng : 31.872754474473425, solutionLat : -29.51453666609916,solutionLng : 28.79425848548701, Address : "ici ou la bas",Country : "Bakistan"},
                {nickname : "Flamby", mapName : "A Diverse World", date:"2021-08-23T20:38:10.000Z",gameType : "Normal",timeLimit : 300,totalScore : 19350,totalTime : 1500,totalDistanceInMeters : 2690672.4557209197,roundScore : 4920,roundDistance : 30023.8399868027,roundTime : 300,playerLat :15.008839600371804, playerLng : -12.662551973440259, solutionLat : 14.83019321997093,solutionLng : -12.45302519455096, Address : "mais nan",Country : "Elysium"}
];
  
  publishResult(data2);
  console.log(data2);
  
})*/
            const queryString = window.location.search;
            console.log(queryString);
            const urlParams = new URLSearchParams(queryString);
            const myId = urlParams.get('id');
            console.log("init :" + myId);
            initSelect(myId); //get nickname?
}


async function initSelect(nickname){

    var url = '/getselect?id=' + nickname;
    
    const options = {
        method: 'GET'
      };


      var response = await fetch(url, options);

      const dataReturned = await response.json();
      console.log(dataReturned);
     
      //init mapName
      var mapDDList = document.getElementById("mapName");
        
      for (var i = 0; i < dataReturned.lMap.length; i++) {
              var elementName = dataReturned.lMap[i];
              var elementDD = document.createElement("option");
              elementDD.value = elementName;
              elementDD.textContent =  elementName;
              mapDDList.appendChild(elementDD);   
              }
              mapDDList.selectedIndex = 0;


      //init gameType

    
        var typeDDList = document.getElementById("gameType");
        
        for (var i = 0; i < dataReturned.lType.length; i++) {
                var elementName = dataReturned.lType[i];
                var elementDD = document.createElement("option");
                elementDD.value = elementName;
                elementDD.textContent =  elementName;
                typeDDList.appendChild(elementDD);   
                }
                typeDDList.selectedIndex = 0;
                //document.getElementById("selections").appendChild(typeDDList);
        

      //init gameTime

      var timeDDList = document.getElementById("timeLimit");
        
      for (var i = 0; i < dataReturned.lTime.length; i++) {
              var elementName = dataReturned.lTime[i];
              var elementDD = document.createElement("option");
              elementDD.value = elementName;
              elementDD.textContent =  elementName;
              timeDDList.appendChild(elementDD);   
              }
              timeDDList.selectedIndex = 0;
}

function publishResult(data){
    var myJSON = JSON.stringify(data);
  //var div = document.createElement('div');
  //var elements = document.getElementsByClassName('tabs');
  //div.innerHTML = myJSON;
  //elements[0].parentNode.insertBefore(div, elements[0]);
    
  
  var url = '/api';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: myJSON
  };
    var response = fetch(url, options);
console.log("body : " + response.body);
}
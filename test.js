async function loadData(){
            
            var divDebug = document.getElementById('gameType');
            var selectType = document.getElementById('gameType');
            var valueType = selectType.options[selectType.selectedIndex].value;
        
            var selectMap = document.getElementById('mapName');
            var valueMap = selectMap.options[selectMap.selectedIndex].value;
        
            var selectTime = document.getElementById('timeLimit');
            var valueTime = selectTime.options[selectTime.selectedIndex].value;

            const queryString = window.location.search;
            console.log(queryString);
            const urlParams = new URLSearchParams(queryString);
            const myId = urlParams.get('id');
        
            url = "/getdata?id=" + myId + "&type=" + valueType + "&map=" + valueMap + "&time=" + valueTime;
            var options  = {
                method: 'GET'
                    };
            
            
            var response = await fetch(url,options);
            const dataReturned = await response.json();
            
                                                                                              
            var top5 = [];                                                                                         
            var mint5 = Math.min(5,dataReturned.length);
                                                                                              console.log(mint5);
                 for (var i = 0; i < mint5 ; i++) {
                 top5.push(dataReturned[i]);                                                                                                                               
            }
                 console.log(JSON.stringify(top5));                                                                             
            var flop5 = [];
            var maxf5 = Math.max(0, dataReturned.length-5);
  console.log(maxf5);
                  for (var i = dataReturned.length-1 ; i > maxf5 ; i--) {
                 flop5.push(dataReturned[i]);                                                                                                                               
            }
              console.log(flop5.length);      
            
            var t5String = " BEST ROUNDS top 5 \n";                                                                                  
            for(var i = 0; i < top5.length ; i++) {
                t5String = t5String.concat(top5[i].distanceInMeters + " m = " + top5[i].roundScore + " points in " + top5[i].time + " seconds at " + top5[i].address + "\n" );                                                                                                                                              
            }                                                                                  
                                                                                       
              document.getElementById("t5").innerHTML = t5String;
                 
            var f5String = " WORST ROUNDS flop 5 \n";                                                                                  
            for(var i = 0; i < flop5.length ; i++) {
                f5String = f5String.concat(flop5[i].distanceInMeters + " m = " + flop5[i].roundScore + " points in " + flop5[i].time + " seconds at " + flop5[i].address + "\n" );                                                                                                                                              
            } 
            document.getElementById("f5").innerHTML = f5String;
                                        
              deleteMarkers();
              addMarkers(dataReturned);
            }
                                        
                                        
              deleteMarkers();
              console.log(dataReturned);
              addMarkers(dataReturned);
            }
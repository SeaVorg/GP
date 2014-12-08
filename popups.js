function formatLon(lon) {
   if (isNaN(lon)) { return lon; }
   if (Math.abs(lon) == 180) { lon = 180 } else {
	   if (lon < 0) { return Math.abs(lon).toString()+'W'; }
	   if (lon > 0) { return lon.toString()+'E'; }
   }
   return lon.toString();
}


function formatLat(lat) {
   if (isNaN(lat)) { return lat; }
   if (lat < 0) { return Math.abs(lat).toString()+'S'; }
   if (lat > 0) { return lat.toString()+'N'; }
   return lat.toString();
}

 function deg2dir(deg){
   if (isNaN(deg)|| deg < 0 || deg > 360) { return null;}
   dir = new Array('N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N');
   return dir[Math.round(deg/22.5)];
}

function parseiso8601(isodate) {
   var p = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})UTC$/;
   var m = isodate.match(p);
   if (m == null || m.length != 7) { return null; }
   var d = new Date();
   d.setUTCFullYear(m[1]);
   d.setUTCMonth(m[2]-1);
   d.setUTCDate(m[3]);
   d.setUTCHours(m[4]);
   d.setUTCMinutes(m[5]);
   d.setUTCSeconds(m[6]);
   d.setUTCMilliseconds(0);
   return d;
}


function createXmlHttpRequest() {
 try {
   if (typeof ActiveXObject != 'undefined') {
     return new ActiveXObject('Microsoft.XMLHTTP');
   } else if (window["XMLHttpRequest"]) {
     return new XMLHttpRequest();
   }
 } catch (e) {
   alert(e.name+': '+e.message);
 }
 return null;
}

function downloadUrl(url, callback) {
 var status = -1;
 var request = createXmlHttpRequest();
 if (!request) {
   return false;
 }

 request.onreadystatechange = function() {
   if (request.readyState == 4) {
     try {
       status = request.status;
     } catch (e) {
       // Usually indicates request timed out in FF.
     }
     if (status == 200 || status == 304) {
    	 if (request.responseXML  && request.responseXML.documentElement) {
    		 callback(request.responseXML, request.status);
    	 } else {
    		 callback(request.responseText, request.status);
    	 }
       request.onreadystatechange = function() {};
     }
   }
 }
 request.open('GET', url, true);
 try {
   request.send(null);
 } catch (e) {
   alert(e.name+': '+e.message);
 }
}

function populateInfoWindow(stn,stnpos,lat,lon,owner,marker) {
   downloadUrl("http://www.corsproxy.com/www.ndbc.noaa.gov/get_observation_as_xml.php?station="+stn, function(xml, responseCode) {
      var html = null;
      if (responseCode != 200 && responseCode != 304) {
         html = '<strong>Station '+stn.toUpperCase()+'<br />'+owner+'<br />Location:<\/strong> '+formatLat(lat)+' '+formatLon(lon)+'<br />There are no recent (&lt; 8 hours) meteorological data for this station.<br .>';
		 //console.log(html);
	  } 
	  else {
         if (xml.documentElement) {
            var data = {datetime:null, name:null, lat:null, lon:null, winddir:null, windspeed:null, windgust:null, waveht:null, domperiod:null, meanwavedir:null, pressure:null, airtemp:null, watertemp:null, dewpoint:null, tide:null, visibility:null};
            data['id'] = xml.documentElement.getAttribute('id');
            data['name'] = xml.documentElement.getAttribute('name');
            data['lat'] = xml.documentElement.getAttribute('lat');
            data['lon'] = xml.documentElement.getAttribute('lon');
			console.log(data['id']);
			console.log(data['name']);
			console.log(data['lat']);
			console.log(data['lon']);
			
            var items=xml.documentElement.childNodes;
            for (var i=0;i<items.length;i++) {
				
               if (items[i].nodeType == 1) {
                  switch (items[i].nodeName) {
                     case 'datetime':
                        data[items[i].nodeName] = parseiso8601(items[i].childNodes[0].nodeValue);
                        break;
                     case 'winddir':
                        var dir = deg2dir(items[i].childNodes[0].nodeValue);
                        if (dir != null) {
                           data[items[i].nodeName] = dir +' ('+items[i].childNodes[0].nodeValue+'&#176;)';
                        } else {
                           data[items[i].nodeName] = items[i].childNodes[0].nodeValue+'&#176;';
                        }
                        break;
                     case 'meanwavedir':
                        var dir = deg2dir(items[i].childNodes[0].nodeValue);
                        if (dir != null) {
                           data[items[i].nodeName] = dir +' ('+items[i].childNodes[0].nodeValue+'&#176;)';
                        } else {
                           data[items[i].nodeName] = items[i].childNodes[0].nodeValue+'&#176;';
                        }
                        break;
                     case 'pressure':
                        var uom = items[i].getAttribute('uom');
                        if (uom != null) {
                           data[items[i].nodeName] = items[i].childNodes[0].nodeValue + ' ' +uom;
                        } else {
                           data[items[i].nodeName] = items[i].childNodes[0].nodeValue;
                        }
                        var ptend = items[i].getAttribute('tendency');
                        if (ptend != null) {
                           data[items[i].nodeName] += ' and ' + ptend;
                        }
                        break;
                     default:
                        var uom = items[i].getAttribute('uom');
                        if (uom != null) {
                           data[items[i].nodeName] = items[i].childNodes[0].nodeValue + ' ' +uom;
                        } else {
                           data[items[i].nodeName] = items[i].childNodes[0].nodeValue;
                        }
                  }
               }
            }
			console.log("yeaah");
			//console.log(html);
            var now = new Date();
            var cutoff = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds())-8*60*60*1000);
            if (data['id'] != null && data['datetime'] != null && data['lat'] != null && data['lon'] != null && data['datetime'] >= cutoff) {
               var title = '<strong>Station '+data['id'].toUpperCase()+'<br />'+owner+'<br />Location:<\/strong> '+formatLat(data['lat'])+' '+formatLon(data['lon'])+'<br /><strong>Date:<\/strong> '+data['datetime'].toUTCString().replace("GMT","UTC")+'<br />';
               var body = '';
               var winds = '';
               if (data['winddir'] != null) { winds += data['winddir']; }
               if (data['windspeed'] != null) { winds += ' at '+data['windspeed']; }
               if (data['windgust'] != null) { winds += ' gusting to '+data['windgust']; }
               if (winds) {
                  body += '<strong>Winds:<\/strong> '+winds+'<br />';
               }
			   //console.log("fine in 1 1");
               if (data['waveht'] != null) { body += '<strong>Significant Wave Height:<\/strong> '+data['waveht']+'<br />'; }
               //console.log("fine in 1 1");
			   if (data['domperiod'] != null) { body += '<strong>Dominant Wave Period:<\/strong> '+data['domperiod']+'<br />'; }
               
			   if (data['meanwavedir'] != null) { body += '<strong>Mean Wave Direction:<\/strong> '+data['meanwavedir']+'<br />'; }
               
			   if (data['pressure'] != null) { body += '<strong>Atmospheric Pressure:<\/strong> '+data['pressure']+'<br />'; }
               
			   if (data['airtemp'] != null) { body += '<strong>Air Temperature:<\/strong> '+data['airtemp']+'<br />'; }
               
			   if (data['dewpoint'] != null) { body += '<strong>Dew Point:<\/strong> '+data['dewpoint']+'<br />'; }
               
			   if (data['watertemp'] != null) { body += '<strong>Water Temperature:<\/strong> '+data['watertemp']+'<br />'; }
               if (data['visibility'] != null) { body += '<strong>Visibility:<\/strong> '+data['visibility']+'<br />'; }
               if (data['tide'] != null) { body += '<strong>Tide:<\/strong> '+data['tide']+'<br />'; }
               html = title+'<div style="max-width:300px;overflow:auto;">'+body+'<\/div>';
            } else {
               html = '<strong>Station '+stn.toUpperCase()+'<br />'+owner+'<br />Location:<\/strong> '+formatLat(lat)+' '+formatLon(lon)+'<br />There are no recent (&lt; 8 hours) meteorological data for this station.<br .>';
			   //console.log("fine in 2 1");
			}
          } else {
             html = "Sorry!  Your browser does not support this application.";
			// console.log("as" );
             return;
          }
      }
	  //console.log(html);
	  finish_HIM(html,marker);
	  return html;
      
   });
}

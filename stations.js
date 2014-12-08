var tsunamis = [];
var stations = [];
var TSUNAMI_STUFF = 20;
var map;
var oms;
var shadow;

function populateInfoWindow(stn,stnpos,lat,lon,owner) {
   downloadUrl("http://www.corsproxy.com/www.ndbc.noaa.gov/get_observation_as_xml.php?station="+stn, function(xml, responseCode) {
      var html = null;
      if (responseCode != 200 && responseCode != 304) {
         html = '<strong>Station '+stn.toUpperCase()+'<br />'+owner+'<br />Location:<\/strong> '+formatLat(lat)+' '+formatLon(lon)+'<br />There are no recent (&lt; 8 hours) meteorological data for this station.<br .>Click <a href="/station_page.php?station='+stn+'" target="_blank">here<\/a> <img src="/images/new_window.png" width="16" height="16" alt="Opens in new window" title="Opens in new window" style="vertical-align:text-top" \/> - <a href="/station_history.php?station='+stn+'" target="_blank">View History<\/a> <img src="/images/new_window.png" width="16" height="16" alt="Opens in new window" title="Opens in new window" style="vertical-align:text-top" \/> for other data from this station.';
      } else {
         if (xml.documentElement) {
            var data = {datetime:null, name:null, lat:null, lon:null, winddir:null, windspeed:null, windgust:null, waveht:null, domperiod:null, meanwavedir:null, pressure:null, airtemp:null, watertemp:null, dewpoint:null, tide:null, visibility:null};
            data['id'] = xml.documentElement.getAttribute('id');
            data['name'] = xml.documentElement.getAttribute('name');
            data['lat'] = xml.documentElement.getAttribute('lat');
            data['lon'] = xml.documentElement.getAttribute('lon');
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
               if (data['waveht'] != null) { body += '<strong>Significant Wave Height:<\/strong> '+data['waveht']+'<br />'; }
               if (data['domperiod'] != null) { body += '<strong>Dominant Wave Period:<\/strong> '+data['domperiod']+'<br />'; }
               if (data['meanwavedir'] != null) { body += '<strong>Mean Wave Direction:<\/strong> '+data['meanwavedir']+'<br />'; }
               if (data['pressure'] != null) { body += '<strong>Atmospheric Pressure:<\/strong> '+data['pressure']+'<br />'; }
               if (data['airtemp'] != null) { body += '<strong>Air Temperature:<\/strong> '+data['airtemp']+'<br />'; }
               if (data['dewpoint'] != null) { body += '<strong>Dew Point:<\/strong> '+data['dewpoint']+'<br />'; }
               if (data['watertemp'] != null) { body += '<strong>Water Temperature:<\/strong> '+data['watertemp']+'<br />'; }
               if (data['visibility'] != null) { body += '<strong>Visibility:<\/strong> '+data['visibility']+'<br />'; }
               if (data['tide'] != null) { body += '<strong>Tide:<\/strong> '+data['tide']+'<br />'; }
               html = title+'<div style="max-width:300px;overflow:auto;">'+body+'<\/div><a href="/station_page.php?station='+stn+'" target="_blank">View Details<\/a> <img src="/images/new_window.png" width="16" height="16" alt="Opens in new window" title="Opens in new window" style="vertical-align:text-top" \/> - <a href="/station_history.php?station='+stn+'" target="_blank">View History<\/a> <img src="/images/new_window.png" width="16" height="16" alt="Opens in new window" title="Opens in new window" style="vertical-align:text-top" \/>';
            } else {
               html = '<strong>Station '+stn.toUpperCase()+'<br />'+owner+'<br />Location:<\/strong> '+formatLat(lat)+' '+formatLon(lon)+'<br />There are no recent (&lt; 8 hours) meteorological data for this station.<br .>Click <a href="/station_page.php?station='+stn+'" target="_blank">here<\/a> <img src="/images/new_window.png" width="16" height="16" alt="Opens in new window" title="Opens in new window" style="vertical-align:text-top" \/> for other data from this station.';
            }
          } else {
             html = "Sorry!  Your browser does not support this application.";
             return;
          }
      }
      if (html != null) {
         if (infowindow  != null) { infowindow.close(); }
         infowindow = new google.maps.InfoWindow({content:html,position:stnpos});
         infowindow.open(map);
      }
   });
}


function stationData(id, stuff) {
  $.ajax({
    type: 'GET',
    url: 'http://www.corsproxy.com/www.ndbc.noaa.gov/get_observation_as_xml.php?station=' + id,
    success: function( data ) {
  
    var result;
    
      var xml;
      if (window.ActiveXObject){
        xml = data.xml;
      } else {
        xml = (new XMLSerializer()).serializeToString(data);
      }
      var xmlData = $.parseXML(xml);
      var $xml = $(xmlData);
	  
	  //console.log($xml);
	  stuff.exml=$xml;
    
    if($xml.find("waveht").length>0) {
      result = parseInt($xml.find("waveht").text());
    } else{
      result = 0;
    }
    
    if(result > TSUNAMI_STUFF  ) tsunamis.push(stuff);
    //console.log(result);
    return result;
    }
  });
}
function addStations() {
  $.ajax({
    type: 'GET',
    //url: "http://www.corsproxy.com/www.ndbc.noaa.gov/ndbcmapstations.json",
    url: "data.json",
    success: function( data ) {
      //console.log(stations);
      $.each(data.station, function( key, val ) {
        
        if(val.data == 'y') {
      var id = val.id;
      var marker = newMarker({lng: parseFloat(val.lon), lat: parseFloat(val.lat)});
	  marker.asd_id=id;
      stationData(id, marker);
	  
	  oms.addMarker(marker);
          
          stations.push(marker);
        }
      });
    }
  })
}

function UpdateStations()
{
  $.each(tsunamis,function(key,val) {
    this.setIcon("images/marker.gif");
    } 
  )
}
function newMarkerTsunami(position) {
  return new google.maps.Marker({
    position: position,
    icon: {
    	url: "images/marker.gif",
    }, optimized: false,
	map: map
  });
}

function newMarker(position) {
  return new google.maps.Marker({
    position: position,
    icon: {
    	url: "images/marker.png",
    }, optimized: false,
	map: map
  });
}var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Lorem ipsum</b> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'+
      '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'link</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';
 var infowindow = new google.maps.InfoWindow({
      content: contentString
  });
  
function Init_SPIDER()
{
  
   oms = new OverlappingMarkerSpiderfier(map,
        {markersWontMove: true, markersWontHide: true});
  
   shadow = new google.maps.MarkerImage(
        'https://www.google.com/intl/en_ALL/mapfiles/shadow50.png',
        new google.maps.Size(37, 34),  // size   - for sprite clipping
        new google.maps.Point(0, 0),   // origin - ditto
        new google.maps.Point(10, 34)  // anchor - where to meet map location
      );

  
  
	  oms.addListener('click', function(marker) {
        //infowindow.setContent(marker.desc);
		infowindow.setContent(marker.exml);
		console.log(marker.asd_log);
        infowindow.open(map, marker);
      });
      oms.addListener('spiderfy', function(markers) {
        for(var i = 0; i < markers.length; i ++) {
          //markers[i].setIcon(iconWithColor(spiderfiedColor));
          markers[i].setShadow(null);
        } 
        infowindow.close();
      });
      oms.addListener('unspiderfy', function(markers) {
        for(var i = 0; i < markers.length; i ++) {
          //markers[i].setIcon(iconWithColor(usualColor));
          //markers[i].setShadow(shadow);
        }
      });
}
var map;
var tsunamis = [];
var stations = [];
var currents = [];
var chicago = new google.maps.LatLng(41.850033, -87.650052);
var TSUNAMI_STUFF = 20;

function createMap() {
	var roadAtlasStyles = [
 	 {
      featureType: 'all',
      elementType: 'labels',
      stylers: [
        { visibility: 'off'}
      ]
    },{
      featureType: 'all',
      elementType: 'geometry',
      stylers: [
        { 
		//color: '#000000' 
		hue: '#6ADAFF'
		}
      ]
    },{
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {  color: '#6ADAFF'
			//color: '#000000'
		}
      ]
    }
  ];

  var mapOptions = {
    zoom: 3,
    center: chicago,
    mapTypeControlOptions: {
      mapTypeIds: []
	  //mapTypeIds: ['shit']
    }
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var styledMapOptions = {
    name: 'WeatherMap'
  };

  var usRoadMapType = new google.maps.StyledMapType(
      roadAtlasStyles, styledMapOptions);

  map.mapTypes.set('Weather Map', usRoadMapType);
  map.setMapTypeId('Weather Map');
}
function createCurrents () {
  $.ajax ({
    type: 'GET',
    url: 'flows.json',
    success: function (data) {
      currents = []
      var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
      };
      $.each(data.currents, function(key, val) {
        var current = new google.maps.Polyline({
          path: val.points,
          strokeColor: val.color,
          strokeOpacity: 1.0,
          strokeWeight: 2,
          icons: [{
            icon: lineSymbol,
            offset: '10%',
            repeat: '30%'
          }]
        });
        current.setMap(map);
        currents.push(current);
      });
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
      //console.log(xml);
	  //console.log($xml.find("waveht"));
      //console.log($xml.find("waveht").text());
      //console.log($xml.find("waveht").attr("uom"));
	  
	  if($xml.find("waveht").length>0)
	  {
	  //console.log(parseInt($xml.find("waveht").text()));
	  result = parseInt($xml.find("waveht").text());
	  }
	  else{
	  //console.log(" fuck no shit" );
	  result = 0;
	  }
	  //return 0;
      //alert(data);
	  
	  if(result > TSUNAMI_STUFF  ) tsunamis.push(stuff);
	  
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
		  //var waveht = stationData(id);
		  
		  //if(waveht>0) console.log("asdadasdasdadasdasdaghsdadasasdadasdasdajd");
		  //console.log("duuude" + id);
		  //console.log(id);
		  //console.log(stationData(id));
		  //var marker;
		  //if(stationData(id)>10){
		  //console.log("TSUNAMI !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
           //var marker = newMarkerTsunami({lng: parseInt(val.lon), lat: parseInt(val.lat)});
		  //}
		  //else{
		  var marker = newMarker({lng: parseInt(val.lon), lat: parseInt(val.lat)});
			/*if(stationData(id)>10){
		  console.log("TSUNAMI !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		  marker.setIcon("images/marker.gif");
		  }
		  else console.log(stationData(id));*/
			stationData(id, marker);
          google.maps.event.addListener(marker, 'click', function() {
            var id = val.id;
			infowindow.open(map,marker);
            stationData(id, marker);
          });
          stations.push(marker);
		  //station_ids.push(val.id);
          /*marker.setVisible(false);
          stations[stations.length - 1].setVisible(true);*/
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

function setMap() {

}

function initialize() {
  createMap();
  createCurrents();
  addStations();
  
  UpdateStations();
  buttenbutt();
}

google.maps.event.addDomListener(window, 'load', initialize);

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
}

 var contentString = '<div id="content">'+
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
  
  
  HomeControl.prototype.home_ = null;
  var toggle1=true;
  var toggle2=true;
  
function buttenbutt()
{
  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv, map, chicago);

  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
}

HomeControl.prototype.getHome = function() {
	  toggle1=!toggle1;
      $.each(stations, function(key, val) {
        this.setVisible(toggle1);
      });
      
}

HomeControl.prototype.setHome = function() {
	toggle2=!toggle2;
	$.each(currents, function(key, val) {
        this.setVisible(toggle2);
      });
}


function HomeControl(controlDiv, map, home) {

  var control = this;
  control.home_ = home;

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var goHomeUI = document.createElement('div');
  goHomeUI.style.backgroundColor = 'white';
  goHomeUI.style.borderStyle = 'solid';
  goHomeUI.style.borderWidth = '1px';
  goHomeUI.style.cursor = 'pointer';
  goHomeUI.style.textAlign = 'center';
  goHomeUI.title = 'Click to enable/disable stations';
  controlDiv.appendChild(goHomeUI);

  // Set CSS for the control interior
  var goHomeText = document.createElement('div');
  goHomeText.style.fontFamily = 'Century Gothic';
  goHomeText.style.fontSize = '20px';
  goHomeText.style.paddingLeft = '4px';
  goHomeText.style.paddingRight = '4px';
  goHomeText.innerHTML = '<b>Stations</b>';
  goHomeUI.appendChild(goHomeText);

  // Set CSS for the setHome control border
  var setHomeUI = document.createElement('div');
  setHomeUI.style.backgroundColor = 'white';
  setHomeUI.style.borderStyle = 'solid';
  setHomeUI.style.borderWidth = '1px';
  setHomeUI.style.cursor = 'pointer';
  setHomeUI.style.textAlign = 'center';
  setHomeUI.title = 'Click to enable/disable currents';
  controlDiv.appendChild(setHomeUI);

  // Set CSS for the control interior
  var setHomeText = document.createElement('div');
  setHomeText.style.fontFamily = 'Century Gothic';
  setHomeText.style.fontSize = '20px';
  setHomeText.style.paddingLeft = '4px';
  setHomeText.style.paddingRight = '4px';
  setHomeText.innerHTML = '<b>Currents</b>';
  setHomeUI.appendChild(setHomeText);

  // Setup the click event listener for Home:
  // simply set the map to the control's current home property.
  google.maps.event.addDomListener(goHomeUI, 'click', function() {
    control.getHome();
  });

  // Setup the click event listener for Set Home:
  // Set the control's home to the current Map center.
  google.maps.event.addDomListener(setHomeUI, 'click', function() {
    control.setHome();
  });
}
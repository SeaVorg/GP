var map;
var stations = [];
var currents = [];
var chicago = new google.maps.LatLng(41.850033, -87.650052);

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
        { color: '#000000' }
      ]
    },{
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        { color: '#FFFFFF' }
      ]
    }
  ];

  var mapOptions = {
    zoom: 3,
    center: chicago,
    mapTypeControlOptions: {
      mapTypeIds: []
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
function stationData(id) {
  $.ajax({
    type: 'GET',
    url: 'http://www.corsproxy.com/www.ndbc.noaa.gov/get_observation_as_xml.php?station=' + id,
    success: function( data ) {
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
	  console.log(parseInt($xml.find("waveht").text()));
	  return parseInt($xml.find("waveht").text());
	  }
	  else{
	  console.log(" fuck no shit" );
	  return 0;
	  }
	  //return 0;
      //alert(data);
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
		  //}
		  
          google.maps.event.addListener(marker, 'click', function() {
            var id = val.id;
            stationData(id);
          });
          stations.push(marker);
          /*marker.setVisible(false);
          stations[stations.length - 1].setVisible(true);*/
        }
      });
    }
  })
}

function initControlls() {
  $("input.layerControll").change(function() {
    checked = this.checked;
    
    if(this.name == "stations") {
      $.each(stations, function(key, val) {
        this.setVisible(checked);
      });
    } else {
      $.each(currents, function(key, val) {
        this.setVisible(checked);
      });
    }
  })
}
function setMap() {

}

function initialize() {
  createMap();
  createCurrents();
  addStations();
  initControlls();
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
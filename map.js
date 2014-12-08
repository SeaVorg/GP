var map;
var chicago = new google.maps.LatLng(41.850033, -87.650052);

function createMap() {
	var roadAtlasStyles = [{
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ 
        visibility: 'off'
      }]
    },{
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ 
		    hue: '#6ADAFF'
		  }]
    },{
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{  
        color: '#6ADAFF'
		}]
  }];

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

function initialize() {
  createMap();
  createCurrents();

  //Init_SPIDER();
  //addStations();
  
  //UpdateStations();
  buttonListeners();
}

google.maps.event.addDomListener(window, 'load', initialize);


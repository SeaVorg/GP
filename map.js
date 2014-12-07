var map;
var currents = [];
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

function initialize() {
  createMap();
  createCurrents();
  addStations();
  
  UpdateStations();
  buttenbutt();
}

google.maps.event.addDomListener(window, 'load', initialize);


<!DOCTYPE html>
<html>
  <head>
    <title>Complex styled maps</title>
    <style>
      html, body, #map-canvas {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script>

var map;
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
        { color: '#FFFF00' }
      ]
    },{
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        { color: '#000050' }
      ]
    }
  ];

  var mapOptions = {
    zoom: 12,
    center: chicago,
    mapTypeControlOptions: {
      mapTypeIds: ['Weather Map']
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
	$.ajax({
    type: 'GET',
    url: "http://www.ndbc.noaa.gov/ndbcmapstations.json",
    xhrFields: {
    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
    // This can be used to set the 'withCredentials' property.
    // Set the value to 'true' if you'd like to pass cookies to the server.
     // If this is enabled, your server must respond with the header
    // 'Access-Control-Allow-Credentials: true'.
      withCredentials: false
    }, headers: {
      Access-Control-Allow-Headers: x-requested-with
    },success: function( data ) {
      var stations = data.stations;
      $.each( stations, function( val ) {
        addMarker(val);
      });
    }
  });

  addMarker({lng: 0, lat: 0});
}

google.maps.event.addDomListener(window, 'load', initialize);

function addMarker(position) {
  var marker = new google.maps.Marker({
    position: position,
    icon: {
    	url: "images/marker.png",
    }, map: map
  });
}



    </script>
  </head>
  <body>
    <div id="map-canvas"></div>
  </body>
</html>
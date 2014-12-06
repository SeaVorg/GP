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
    <script>

var map;
var chicago = new google.maps.LatLng(41.850033, -87.650052);

function initialize() {

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
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas']
    }
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var styledMapOptions = {
    name: 'US Road Atlas'
  };

  var usRoadMapType = new google.maps.StyledMapType(
      roadAtlasStyles, styledMapOptions);

  map.mapTypes.set('usroadatlas', usRoadMapType);
  map.setMapTypeId('usroadatlas');
}

google.maps.event.addDomListener(window, 'load', initialize);

    </script>
  </head>
  <body>
    <div id="map-canvas"></div>
  </body>
</html>
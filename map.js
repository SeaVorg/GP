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
      console.log(xml);
      console.log($xml.find("windspeed").text());
      console.log($xml.find("windspeed").attr("uom"));
      //alert(data);
    }
  });
}

function initialize() {
createMap();
	$.ajax({
    type: 'GET',
    url: "http://www.corsproxy.com/www.ndbc.noaa.gov/ndbcmapstations.json",
    //url: "data.json",
    success: function( data ) {
      var stations = data.station;
      console.log(stations);
      $.each(stations, function( key, val ) {
        
        if(val.data == 'y') {
          var marker = newMarker({lng: parseInt(val.lon), lat: parseInt(val.lat)});
          google.maps.event.addListener(marker, 'click', function() {
            var id = val.id;
            stationData(id);
          });
        }
      });
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function newMarker(position) {
  return new google.maps.Marker({
    position: position,
    icon: {
    	url: "images/marker.png",
    }, map: map
  });
}
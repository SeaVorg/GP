var tsunamis = [];
var markers = [];
var TSUNAMI_STUFF = 20;
var map;


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
    
    if(result > TSUNAMI_STUFF  ) {
		stuff.setIcon("images/marker.gif");
	}
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
          
          
		  var latLng = new google.maps.LatLng(parseFloat(val.lat),
              parseFloat(val.lon));
          var marker = new google.maps.Marker({
            position: latLng,
			icon: {
			url: "images/marker.png",
			},
			optimized: false
			});
			stationData(id,marker);
			google.maps.event.addListener(marker, 'click', function() {
            var id = val.id
			populateInfoWindow(id,"",marker.position.k,marker.position.B,"",marker);
            stationData(id,marker);
          
          });
          markers.push(marker);
		  
        }
      }
	  );
	   markerCluster = new MarkerClusterer(map, markers);
    }
  })
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
 var infowindow = new google.maps.InfoWindow({
  });
  
  
  function finish_HIM(html, marker)
  {
	console.log(html);
	html  = '<div id="content">'+ html + '</div>';
	infowindow.setContent(html);
    infowindow.open(map, marker);
  }
  

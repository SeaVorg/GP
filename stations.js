var tsunamis = [];
var stations = [];
var TSUNAMI_STUFF = 20;
var map;
var oms;
var shadow;

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
	  
	  console.log($xml);
	  stuff.exml=$xml;
    
    if($xml.find("waveht").length>0) {
      result = parseInt($xml.find("waveht").text());
    } else{
      result = 0;
    }
    
    if(result > TSUNAMI_STUFF  ) tsunamis.push(stuff);
    console.log(result);
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
		infowindow.setContent(marker.asd_id);
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
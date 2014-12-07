var currents = [];
var REPEAT = 75;
var STEP = 1;
var offset = 0;
var INTERVAL = 25;

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
          strokeOpacity: 0.8,
          strokeWeight: 2,
          icons: [{
            icon: lineSymbol,
            offset: '0px',
            repeat: REPEAT + 'px'
          }]
        });
        current.setMap(map);
        currents.push(current);
      });
    }
  });
  currentsAnimate();
}

function currentsAnimate () {
  offset += STEP;
  if(offset >= REPEAT) {
    offset = 0;
  }
  $.each(currents, function(key, val) {
    var icons = this.get('icons');
    icons[0].offset = offset + "px";
    this.set('icons', icons);
    
  });
  setTimeout(currentsAnimate, INTERVAL);
}
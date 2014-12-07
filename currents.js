var currents = [];
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
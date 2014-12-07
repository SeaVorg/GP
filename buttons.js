var displayStations = true;
var displayCurrents = true;
  
function buttonListeners() {
  $("#stationsToggle").click(function() {
    if(displayStations) {
      $("#stationsToggle").removeClass("selected");
      $("#stationsToggle").addClass("unselected");
    } else {
      $("#stationsToggle").addClass("selected");
      $("#stationsToggle").removeClass("unselected");
    }
    displayStations = !displayStations;
      $.each(stations, function(key, val) {
        this.setVisible(displayStations);
      });
  });

  $("#currentsToggle").click(function() {
    displayCurrents = !displayCurrents;
      $.each(currents, function(key, val) {
        this.setVisible(displayCurrents);
      });
  });
}
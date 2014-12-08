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
      $.each(markers, function(key, val) {
        this.setVisible(displayStations);
      });
  });

  $("#currentsToggle").click(function() {
    if(displayCurrents) {
      $("#currentsToggle").removeClass("selected");
      $("#currentsToggle").addClass("unselected");
    } else {
      $("#currentsToggle").addClass("selected");
      $("#currentsToggle").removeClass("unselected");
    }
    displayCurrents = !displayCurrents;
      $.each(currents, function(key, val) {
        this.setVisible(displayCurrents);
      });
  });

}
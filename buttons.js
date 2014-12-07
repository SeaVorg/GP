//tvorenie na ge6a
//Primer za6to ne se pi6e html/css v javascript
//NOTE: vse pak editnah bolda 4e be6e tvurde sakat
HomeControl.prototype.home_ = null;
var toggle1=true;
var toggle2=true;
  
function buttenbutt()
{
  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv, map, chicago);

  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
}

HomeControl.prototype.getHome = function() {
	  toggle1=!toggle1;
      $.each(stations, function(key, val) {
        this.setVisible(toggle1);
      });
      
}

HomeControl.prototype.setHome = function() {
	toggle2=!toggle2;
	$.each(currents, function(key, val) {
        this.setVisible(toggle2);
      });
}


function HomeControl(controlDiv, map, home) {

  var control = this;
  control.home_ = home;

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var goHomeUI = document.createElement('div');
  goHomeUI.style.backgroundColor = 'white';
  goHomeUI.style.borderStyle = 'solid';
  goHomeUI.style.borderWidth = '1px';
  goHomeUI.style.cursor = 'pointer';
  goHomeUI.style.textAlign = 'center';
  goHomeUI.title = 'Click to enable/disable stations';
  controlDiv.appendChild(goHomeUI);

  // Set CSS for the control interior
  var goHomeText = document.createElement('div');
  goHomeText.style.fontFamily = 'Century Gothic';
  goHomeText.style.fontSize = '20px';
  goHomeText.style.paddingLeft = '4px';
  goHomeText.style.paddingRight = '4px';
  goHomeText.style.fontWeight = 'bold';
  goHomeText.innerHTML = 'Stations';
  goHomeUI.appendChild(goHomeText);

  // Set CSS for the setHome control border
  var setHomeUI = document.createElement('div');
  setHomeUI.style.backgroundColor = 'white';
  setHomeUI.style.borderStyle = 'solid';
  setHomeUI.style.borderWidth = '1px';
  setHomeUI.style.cursor = 'pointer';
  setHomeUI.style.textAlign = 'center';
  setHomeUI.title = 'Click to enable/disable currents';
  controlDiv.appendChild(setHomeUI);

  // Set CSS for the control interior
  var setHomeText = document.createElement('div');
  setHomeText.style.fontFamily = 'Century Gothic';
  setHomeText.style.fontSize = '20px';
  setHomeText.style.paddingLeft = '4px';
  setHomeText.style.paddingRight = '4px';
  setHomeText.style.fontWeight = 'bold';
  setHomeText.innerHTML = 'Currents';
  setHomeUI.appendChild(setHomeText);

  // Setup the click event listener for Home:
  // simply set the map to the control's current home property.
  google.maps.event.addDomListener(goHomeUI, 'click', function() {
    control.getHome();
  });

  // Setup the click event listener for Set Home:
  // Set the control's home to the current Map center.
  google.maps.event.addDomListener(setHomeUI, 'click', function() {
    control.setHome();
  });
}
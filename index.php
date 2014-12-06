<?php
  $connection = new mysqli('localhost', 'root', 'pass', 'info');
  if(!$connection) {
    echo "Can't connect";
  } else {
    echo "Should be connected";
    $data = $connection->query("SELECT * FROM accounts;");
    while($row = $data->fetch_assoc()) {
      print_r($row);
    }
  }
?>
<!DOCTYPE HTML>
<html>
  <head>
    <script src="http://www.webglearth.com/v2/api.js"></script>
    <script>
      function initialize() {
        var earth = new WE.map('earth_div');
        WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth);
				var options = { bounds: [[35.98245136, -112.26379395],[36.13343831, -112.10998535]], 
								        minZoom: 10,
								        maxZoom: 16 };
				WE.tileLayer('http://tileserver.maptiler.com/grandcanyon/{z}/{x}/{y}.png', options).addTo(earth);
      }
    </script>
  </head>
  <body onload="initialize()">
    <div id="earth_div" style="width:600px;height:400px;"></div>
  </body>
	<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
</html>

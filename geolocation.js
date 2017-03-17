var coords = "hello", coordInt,pointArray = [],coordArray,locInfo,currentLocation = [0, 0],coords2=0,fileInput = document.getElementById('browse'),dropBox, count = 0;
window.onload= function() {
	dropBox = document.getElementById("dropBox");
	
	dropBox.ondragenter = ignoreDrag;
	dropBox.ondragover = ignoreDrag;
	dropBox.ondrop = drop;
}

function ignoreDrag(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e){
	e.stopPropagation();
	e.preventDefault();
	
	var data = e.dataTransfer;
	var files = data.files;
	processFiles(files);
	
}

function processFiles(files){
	var file = files[0];
	var textType = /text.*/;

	if (file.type.match(textType)) {
		var reader = new FileReader();
		reader.onload = function(evnt){
			coords2 = reader.result;
			fileInfo.innerHTML = "Entered coords : (" + coords2 + ")";
			startWorker(reader.result);
		};
		reader.readAsText(file);
	}
	else{
		document.getElementById('fileInfo').innerHTML = "Please resubmit, invalid file!";
	}
	
}
function updateCurrent() {
	
	currentLocation[0] = document.getElementById("lat").value;
	currentLocation[1] = document.getElementById("long").value;
	 var pos = {lat: currentLocation[0],
              lng: currentLocation[1]};


	
		var  map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: -34.397, lng: 150.644},
          zoom: 12
        });
	
				var  infoWindow = new google.maps.InfoWindow({map: map});	document.getElementById("coordInfo").innerHTML = "Your current coordinates are {" + currentLocation[0] + ", " + currentLocation[1] + "}";
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200) {
						locInfo = JSON.parse(this.responseText);						
						document.getElementById("addressInfo").innerHTML = "Your current address is " + locInfo.results[0].formatted_address;
						
					}
				}
				xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + currentLocation[0] + "," + currentLocation[1] + "&key=AIzaSyCYp1RkgWOe4KJWM9KnKuiC5jp1i0VszzA", true);
	
				xhttp.send();
			infoWindow.setPosition(pos);
            infoWindow.setContent('New Location!');
			map.setZoom(15);
            map.setCenter(pos);
			startWorker(coords2);
        
}
function initialize() {
	
       var  map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 12
        });
       var  infoWindow = new google.maps.InfoWindow({map: map});

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {lat: position.coords.latitude,
              lng: position.coords.longitude};
			
			currentLocation[0] = pos.lat;
			currentLocation[1] = pos.lng;
			document.getElementById("coordInfo").innerHTML = "Your current coordinates are {" + currentLocation[0] + ", " + currentLocation[1] + "}";
			

				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200) {
						locInfo = JSON.parse(this.responseText);						
						document.getElementById("addressInfo").innerHTML = "Your current address is " + locInfo.results[0].formatted_address;
						
					}
				}
				xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + currentLocation[0] + "," + currentLocation[1] + "&key=AIzaSyCYp1RkgWOe4KJWM9KnKuiC5jp1i0VszzA", true);
	
				xhttp.send();

	
            infoWindow.setPosition(pos);
            infoWindow.setContent('Found');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
	  
function startWorker(cord) {
document.getElementById("result").innerHTML = "";
count = 0;
if(count==0){
            document.getElementById("result").innerHTML = "<h3>Distance: </h3>";
}
    if(typeof(Worker) !== "undefined") {
        if(typeof(distCalc) == "undefined") {
            distCalc = new Worker("distance.js");
        }
        distCalc.postMessage({"args": ["start", cord ,currentLocation[0], currentLocation[1]]});
		distCalc.onmessage = function(event) {
				count++;
               document.getElementById("result").innerHTML += " "+"["+count+"]: " + Math.round(event.data * 100) / 100+" km<br>";
        };
		
    } else {
        document.getElementById("result").innerHTML = "Web worker not supported.";
    }
}

function stopWorker() { 
    distCalc.terminate();
    distCalc = undefined;
}
var lat2 = 0;
var lon2 = 0;
var coordArray;
var pointArray;
var i;



onmessage = function(event){
	coordString = event.data.args[1];
	lat2 = event.data.args[2];	
	lon2 = event.data.args[3];
	
	coordArray = coordString.split("\n");
	// Split into two parts
	for(i=0; i<coordArray.length; i++){
		pointArray = coordArray[i].split(",");
		getDistance();
	}
	
	
}


function getDistance() {
    postMessage(haversine(pointArray[0], pointArray[1],lat2,lon2));
    
}

function haversine() {
       var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
       var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
       var R = 6372.8; // km
       var dLat = lat2 - lat1;
       var dLon = lon2 - lon1;
       var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
       var c = 2 * Math.asin(Math.sqrt(a));
	
       return R * a;
}
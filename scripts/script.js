/*global $ google setMapOnAll navigator*/
var map, infoWindow;
var service; //Load map for PlacesService
var locationSearch = {
  query: 'Zoo Singapore',
  fields: ['name', 'geometry'],
}; //for holding the data to set the map
var markers = [];
var service;

// var searchBox = new google.m/aps.places.SearchBox(input);

//Initiate google map to be displayed
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 1.3521, lng: 103.8198 },
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);
  getCurrentLocation();
  
}
//Shows the current location of user else return error
function getCurrentLocation(){
  if (navigator.geolocation) {
    //get the location of the user current position
    navigator.geolocation.getCurrentPosition(function(position) { // get user position
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      infoWindow.setPosition(pos); // set the window to the location of user
      markerPlacement(pos, map) //set the marker to the location of the user, pos contains the lat and lng
      map.setCenter(pos); //Set the map to center to the position set in pos
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
//function to send Error message if location sevice fail
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

//function to place marker of coordinates given
//myLatLng to set location, map to set map to place marker
function markerPlacement(myLatLng, map) { 
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
    // title: 'Your location'
  })
  markers.push(marker);
}
function createMarker(place,map) {
  clearMarker();
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
  });
  // Gives info about location when click upon
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  markers.push(marker);
}
function clearMarker(){
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}

//Search for location and place a marker on the map and center to the location
function searchAndPlace(locationSearch){
    service.findPlaceFromQuery(locationSearch, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i],map);
          // console.log(results[i]);
          // markerPlacement(results[i], map);
        }
        map.setCenter(results[0].geometry.location);
        // console.log (results[0].geometry.location)
      }
    });
}


$(function() {
  // Get the input location from user; Set to search within Singapore Only
  $("#location-submit").click(function() {
    // marker.setMap(null);
    locationSearch.query = ($("#search").val()) + " Singapore"; 
    searchAndPlace(locationSearch);
  })
})
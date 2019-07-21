/*global $ google setMapOnAll navigator*/
var map, infoWindow;
var service; //Load map for PlacesService
// var locationSearch = {
//   query: 'Zoo Singapore',
//   fields: ['name', 'geometry'],
// }; //for holding the data to set the map
var markers = [];
// var service = new google.maps.places.PlacesService(map);

// var searchBox = new google.maps.places.SearchBox(input);

//Initiate google map to be displayed
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 1.3521, lng: 103.8198 },
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);
  
  getCurrentLocation();
  // searchAndPlace(locationSearch)
  // var searchBox = new google.maps.places.SearchBox(input);
   
  // Bias the SearchBox results towards current map's viewport.
  // map.addListener('bounds_changed', function() {
  //   searchBox.setBounds(map.getBounds());
  // });   
   
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  // searchBox.addListener('places_changed', function() {
  //   var places = searchBox.getPlaces();

  //   if (places.length == 0) {
  //     return;
  //   }
  //   // Clear out the old markers.
  //   markers.forEach(function(marker) {
  //     marker.setMap(null);
  //   });
  //   markers = [];
  // // For each place, get the icon, name and location.
  //   var bounds = new google.maps.LatLngBounds();
  //   places.forEach(function(place) {
  //     if (!place.geometry) {
  //       console.log("Returned place contains no geometry");
  //       return;
  //     }
  //     var icon = { //Icon Styling
  //       url: place.icon,
  //       size: new google.maps.Size(71, 71),
  //       origin: new google.maps.Point(0, 0),
  //       anchor: new google.maps.Point(17, 34),
  //       scaledSize: new google.maps.Size(25, 25)
  //     };

  //     // Create a marker for each place.
  //     markers.push(new google.maps.Marker({
  //       map: map,
  //       icon: icon,
  //       title: place.name,
  //       position: place.geometry.location
  //     }));

  //     if (place.geometry.viewport) {
  //       // Only geocodes have viewport.
  //       bounds.union(place.geometry.viewport);
  //     } else {
  //       bounds.extend(place.geometry.location);
  //     }
  //   });
  //   map.fitBounds(bounds);
  // });
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
      markers.push(pos)
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
  markers.push(myLatLng)
  console.log(markers);
}
//Search for location and place a marker on the map and center to the location
// function searchAndPlace(locationSearch){
//     service.findPlaceFromQuery(locationSearch, function(results, status) {
//       if (status === google.maps.places.PlacesServiceStatus.OK) {
//         for (var i = 0; i < results.length; i++) {
//           createMarker(results[i]);
//           console.log(results[i]);
//           // markerPlacement(results[i], map);
//         }
//         map.setCenter(results[0].geometry.location);
//         console.log (results[0].geometry.location)
//       }
//     });
// }
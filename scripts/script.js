/*global $ google*/
// $(function() {
//     /* global $ google navigator*/
//     var map, map2, infoWindow;

//     function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//             center: { lat: 1.3521, lng: 103.8198 },
//             zoom: 10
//         });
//         map2 = new google.maps.Map(document.getElementById('map2'), {
//             center: { lat: 1.3521, lng: 103.8198 },
//             zoom: 18
//         });

//         infoWindow = new google.maps.InfoWindow;
//         if (navigator.geolocation) {
//             //get the location of the user current position
//             navigator.geolocation.getCurrentPosition(function(position) { // get user position
//                 var pos = {
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 };

//                 infoWindow.setPosition(pos); // set the window to the location of user
//                 markerPlacement(pos, map) //set the marker to the location of the user, pos contains the lat and lng
//                 markerPlacement(pos, map2) //set the marker to the location of the user, pos contains the lat and lng

//                 // infoWindow.setContent('You are here'); //Message to User at the location set
//                 // infoWindow.open(map);    //Display the text in line 63
//                 // infoWindow.open(map2); 

//                 map.setCenter(pos); //Set the map to center to the position set in pos
//                 map2.setCenter(pos);

//             }, function() {
//                 handleLocationError(true, infoWindow, map.getCenter());
//             });

//         }
//         else {
//             // Browser doesn't support Geolocation
//             handleLocationError(false, infoWindow, map.getCenter());
//         }
//     }

//     //function to place marker of coordinates given
//     function markerPlacement(myLatLng, map) { //myLatLng to set location, map to set map to place marker
//         var marker = new google.maps.Marker({
//             position: myLatLng,
//             map: map,
//             title: 'Hello World!'
//         })
//     }

//     //function to set window center to user location
//     function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//         infoWindow.setPosition(pos);
//         infoWindow.setContent(browserHasGeolocation ?
//             'Error: The Geolocation service failed.' :
//             'Error: Your browser doesn\'t support geolocation.');
//         infoWindow.open(map);
//     }
// })

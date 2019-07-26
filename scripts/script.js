/*global $ google setMapOnAll navigator axios*/
var map, infoWindow;
var service; //Load map for PlacesService
var locationSearch = {
  query: 'Zoo Singapore',
  fields: ['name', 'geometry'],
}; //for holding the data to set the map
var markers = [];
var convertSV21;
var temp;

//GOOGLE MAP FUNCTIONS
//DISPLAY MAP
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 1.3521, lng: 103.8198 },
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);
  getCurrentLocation();
  
}
//FUNCTION TO GET THE LOCATION OF USER
function getCurrentLocation(){
  if (navigator.geolocation) {
    //get the location of the user current position
    navigator.geolocation.getCurrentPosition(function(position) { // get user position
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // console.log(position.coords)
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
//CREATE MARKER FUNCTION FOR CURRENT LOCATION
function markerPlacement(myLatLng, map) { 
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
    // title: 'Your location'
  })
  markers.push(marker);
}
function createMarker(place,map) {
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
  });
  // SHOWS THE LOCATION DETAIL WHEN CLICK UPON
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  markers.push(marker);
}
//FUNCTION TO REMOVE MARKERS
function clearMarker(){
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}
//FUNCTION TO SEARCH FOR A LOCATION AND PLACE A MARKER
function searchAndPlace(locationSearch){
    clearMarker();
    service.findPlaceFromQuery(locationSearch, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i],map);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
}

var dataSource = "https://api.data.gov.sg/v1/transport/carpark-availability";
var dataSource2 = "carparkdata.json";
var carparkData = []

//AXIO TO GET DATA FROM API
function getDataFromEndpoint(callback) {
  axios.get(dataSource)
    .then(function(response) {
      if (response){
        let result = response.data.items[0].carpark_data;
        // // console.log(result)
        callback(result)
      }
    })
}
//AXIO TO GET DATA FROM JSON FILE (local)
function getDataFromFile(callback) {
  axios.get(dataSource2)
    .then(function(response) {
      let result = response.data;
      // console.log(result)
      callback(result) 
    })
}
//HEVERSINE FORMULA TO CALCULATE DISTANCE BETWEEN 2 LATLNG (CREDIT to stackOverflow solution)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

//AXIO TO GET DATA FROM API
function getConvertData(callback) {
  axios.get(convertSV21)
    .then(function(response) {
      let result = response.data;
      console.log(result)
      var pos = {
        lat : result.latitude,
        lng : result.longitude
      }
      callback(pos);
    })
}


// var x=33758.4143;
// var y=33695.5198;
// temp = getConvertData(x,y)
// alert (getDistanceFromLatLonInKm(1.3521, 103.8198, 1.3531,103.8198 ))
// console.log(temp)

//ORIGINAL working set
getDataFromFile(function(carparkAddInfo){
  getDataFromEndpoint(function(data){
    for (let item in data) {
      var temp = []
      temp[item] = { "carpark_number": data[item].carpark_number }
      
      // console.log(temp)
      // console.log(carparkAddInfo[item2].car_park_no)
      for (let item2 in carparkAddInfo) {
        if (carparkAddInfo[item2].car_park_no == temp[item].carpark_number) {
          carparkData[item] = {
            "carpark_number": data[item].carpark_number,
            "lot_type": data[item].carpark_info[0]["lot_type"],
            "lots_available": data[item].carpark_info[0]["lots_available"],
            "total_lots": data[item].carpark_info[0]["total_lots"],
            "address": carparkAddInfo[item2].address,
            "car_park_basement": carparkAddInfo[item].car_park_basement,
            "car_park_decks": carparkAddInfo[item].car_park_decks,
            "car_park_type": carparkAddInfo[item].car_park_type,
            "free_parking": carparkAddInfo[item].free_parking,
            "gantry_height": carparkAddInfo[item].gantry_height,
            "night_parking": carparkAddInfo[item].night_parking,
            "short_term_parking": carparkAddInfo[item].short_term_parking,
            "type_of_parking_system": carparkAddInfo[item].type_of_parking_system,
            "x_coord": carparkAddInfo[item].x_coord,
            "y_coord": carparkAddInfo[item].y_coord}
        } 
      }
    }
  })
})
// getDataFromFile(function(carparkAddInfo){
//   getDataFromEndpoint(function(data){
//     for (let item in data) {
//       carparkData[item] = {
//         "carpark_number": data[item].carpark_number,
//         "lot_type": data[item].carpark_info[0]["lot_type"],
//         "lots_available": data[item].carpark_info[0]["lots_available"],
//         "total_lots": data[item].carpark_info[0]["total_lots"]
//       };

//       for (let item2 in carparkAddInfo) {
//         if (carparkAddInfo[item2].car_park_no == data[item].carpark_number) {
  
//           Object.assign(carparkData[item], {
//             "address": carparkAddInfo[item2].address,
//             "car_park_basement": carparkAddInfo[item].car_park_basement,
//             "car_park_decks": carparkAddInfo[item].car_park_decks,
//             "car_park_type": carparkAddInfo[item].car_park_type,
//             "free_parking": carparkAddInfo[item].free_parking,
//             "gantry_height": carparkAddInfo[item].gantry_height,
//             "night_parking": carparkAddInfo[item].night_parking,
//             "short_term_parking": carparkAddInfo[item].short_term_parking,
//             "type_of_parking_system": carparkAddInfo[item].type_of_parking_system,
//             "x_coord": carparkAddInfo[item].x_coord,
//             "y_coord": carparkAddInfo[item].y_coord})
//         } 
//       }
//     }
//   })
// })
// alert("testing")

// datatest = [
//   {a:1,b:2},
//   {c:1,d:2},
//   {e:1,f:2},
//   {g:1,h:2},
//   ]
  
// console.log(datatest)
console.log(carparkData)

$(function() {
  //TO DETECT FOR CLICK FOR SEARCH & PLACE NEW MARKER
  $("#location-submit").click(function() {
    locationSearch.query = ($("#search").val()) + " Singapore"; 
    searchAndPlace(locationSearch);
    $("#search").val();
  });
  //TO DETECT FOR 'ENTER' BY USER FOR SEARCH & PLACE NEW MARKER
  $("#search").keyup(function(){
    if (event.keyCode === 13) {
      locationSearch.query = ($("#search").val()) + " Singapore"; 
      searchAndPlace(locationSearch);
      $("#search").val();      
    }
  })
  //TO DETECT FOR CLICK FOR SUBMIT
  $('#current-location').click(function(){
    clearMarker();
    getCurrentLocation()

  });
  //TO DETECT CHANGE IN DROP-DOWN SELECTION FOR THE RADIUS OF VIEW FOR NEARBY CARPARKS
  $(".search-drop").change(function() {
      var v = $('.search-drop').val();
      if (v == 0){
        alert("500m");
      } 
      else if (v == 1){
        alert('1km')
      }
      else {
        alert('2km')
      }
  });
  
  $('#start-prog').click(function(){
    alert("clicked liao");
  })
})
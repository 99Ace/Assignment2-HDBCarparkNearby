/*global $ google navigator axios*/
var map, infoWindow;
var markers = [];
var marker;
var radius;
var nearbyCarpark=[]

//GOOGLE MAP FUNCTIONS
//DISPLAY MAP
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 1.3521, lng: 103.8198 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;
  getCurrentLocation();
  autoCompleteEntry();
}
//FUNCTION TO GET THE LOCATION OF USER
function getCurrentLocation() {
  if (navigator.geolocation) {
    //get the location of the user current position
    navigator.geolocation.getCurrentPosition(function(position) { // get user position
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos); // set the window to the location of user
      markerPlacement(pos, map) //set the marker to the location of the user, pos contains the lat and lng
      map.setCenter(pos); //Set the map to center to the position set in pos
      //GET FUNCTION TO FIND AND DISPLAY THE CARPARKS WITHIN THE USER RANGE BASED ON THE USER'S CURRENT LOCATION
      carparkInRadius(pos.lat, pos.lng)
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

function autoCompleteEntry() {
  var input = document.getElementById('place-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  // Set initial restrict to the greater list of countries.
  autocomplete.setComponentRestrictions(
    // LOCATION OF SEARCH RESTRICTED TO SINGAPORE
    { 'country': ['sg'] });
  // Specify only the data fields that are needed.
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name']);
  // 'address_components' - address of place searched
  // , 'geometry' - lat lng
  // 'icon' - icon 
  // 'name' - name of place searched
  // OPEN A NEW INFOWINDOW TO DISPLAY THE MARKER (COMPULSORY)
  // var infowindow = new google.maps.InfoWindow();
  // GET THE SELECTED FROM THE DROP DOWN LIST BY INFO WINDOW (REQUIRED SINCE YOU NEED TO ALLOW USER TO SELECT FROM THE LIST)
  var infowindowContent = document.getElementById('infowindow-content');
  // SETTING THE MARKER/S TO BE PLACE ON MAP
  infoWindow.setContent(infowindowContent);
  marker = new google.maps.Marker({
    map: map, //DISPLAY ON WHICH MAP
    // anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', function() {
    clearMarker();
    infoWindow.close();
    marker.setVisible(false); // KINDA HIDING THE MARKER ONLY INSTEAD OF DELETING
    // GET AND STORE THE SEARCH INFORMATION
    var place = autocomplete.getPlace();
    // ERROR MESSAGE IF WRONG INFO ENTERED
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    // if (place.geometry.viewport) {
    //   map.fitBounds(place.geometry.viewport);
    // }
    // else {
    map.setCenter(place.geometry.location);
    map.setZoom(15); // Why 17? Because it looks good.
    // }
    marker.setPosition(place.geometry.location); // SETTING MARKER POSITION
    console.log(marker)
    marker.setVisible(true); // MAKE MARKER VISIBLE TO DISPLAY ON MAP

    // STORE THE ADDRESS INFO FOR DISPLAY IN INFORMATION FOR MARKER
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
    // PLACE THE INFORMATION OF THE MARKER ON THE MAP
    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    // place the marker
    // infowindow.open(map, marker);
    // marker.setMap(null)
    // console.log(marker.position)
    
    // markerPlacement (pos,map);
    document.getElementById("place-input").value = "";

    markers.push(marker);
    console.log(markers)
    carparkInRadius(marker.position.lat(), marker.position.lng())
  })
}
//CREATE MARKER FUNCTION FOR CURRENT LOCATION
function markerPlacement(myLatLng, map) {
  var marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: myLatLng
  });
  markers.push(marker);
}

function markerCarparks(myLatLng, map) {
  var icon = "https://img.icons8.com/color/48/000000/map-pin.png";
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: icon
    // title: 'Your location'
  });
  markers.push(marker);
}

//FILTER THE CARPARKS WITHIN THE USER-SELECTED RADIUS
function carparkInRadius(lat, lng) {
  var checker = [];
  var i = 0;
  for (let item in carparkData) {
    var latPos = lat;
    var lngPos = lng;
    var latCP = carparkData[item].x_coord;
    var lngCP = carparkData[item].y_coord;
    var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP);
    
    checker.push(distance);
    if (distance <= radius) {
      var cp = {
        lat: latCP,
        lng: lngCP
      };
      markerCarparks(cp, map);
      nearbyCarpark[i]=carparkData[item];
      Object.assign( nearbyCarpark[i], { 'distance' : distance });
      i++;
    }
  }
  console.log(nearbyCarpark);
}

//function toggleBounce() {
//   if (marker.getAnimation() !== null) {
//     marker.setAnimation(null);
//   }
//   else {
//     marker.setAnimation(google.maps.Animation.BOUNCE);
//   }
// }
//FUNCTION TO REMOVE MARKERS
function clearMarker() {
  markers.forEach(function(m) {
    m.setMap(null);
  });
  markers = [];
  marker = new google.maps.Marker({
    map: map, //DISPLAY ON WHICH MAP
  });
}
//FUNCTION TO SEARCH FOR A LOCATION AND PLACE A MARKER


var dataSource = "https://api.data.gov.sg/v1/transport/carpark-availability";
var dataSource2 = "carparkdata.json";
var carparkData = [];
var convertSV21;

//AXIO TO GET DATA FROM API
function getDataFromEndpoint(callback) {
  axios.get(dataSource)
    .then(function(response) {
      if (response) {
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
//AXIO TO CONVERT XY TO LATLNG
function getConvertData(callback) {
  axios.get(convertSV21)
    .then(function(response) {
      let result = response.data;
      // console.log(result)
      callback(result);
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

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

//ORIGINAL working set TO PROCESS DATA
getDataFromFile(function(carparkAddInfo) {
  getDataFromEndpoint(function(data) {
    for (let item in data) {
      var temp_data = [];
      temp_data[item] = { "carpark_number": data[item].carpark_number };
      for (let item2 in carparkAddInfo) {
        if (carparkAddInfo[item2].car_park_no == temp_data[item].carpark_number) {
          convertSV21 = `https://developers.onemap.sg/commonapi/convert/3414to4326?X=${carparkAddInfo[item2].x_coord}&Y=${carparkAddInfo[item2].y_coord}`;
          getConvertData(function(latLngConverted) {
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
              "x_coord": latLngConverted.latitude,
              "y_coord": latLngConverted.longitude
            }
          })
        }
      }
    }
  })
})
console.log(carparkData);

$(function() { //TO DETECT FOR CLICK FOR SEARCH & PLACE NEW MARKER
  $("#hide-icon").click(function(){
    $("#instruction-detail").slideUp("slow");
    $("#hide-icon").hide();
    $("#show-icon").show();
  });
  $("#show-icon").click(function(){
    $("#instruction-detail").slideDown("slow");
    $("#hide-icon").show();
    $("#show-icon").hide();
  });  
  $(".radius").click(function() {
    radius = $(this).val();
    var pos = markers[0].position;
    clearMarker();
    markerPlacement(pos, map);
    carparkInRadius(pos.lat(), pos.lng());
  });
  $("#search-location").click(function(){
    // alert("search loc")
    $("#place-input").show();
  });
  //TO DETECT FOR SELECT OF CURRENT LOCATION
  $('#current-location').click(function() {
    clearMarker();
    $("#place-input").hide();
    getCurrentLocation();
  });
});

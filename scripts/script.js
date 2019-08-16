/*global $ google navigator axios MarkerClusterer*/
var map, infoWindow;
var currentMarker = [];
var iconMarker = [
      "https://img.icons8.com/color/48/000000/car.png",
      "https://img.icons8.com/doodle/48/000000/flag--v4.png"
  ]  
var card = document.getElementById('pac-card');
var markerTracker =[];
var locations = [];
var markers=[];
var markerCluster;
var radius;
var counter =1;
//GOOGLE MAP FUNCTIONS
//DISPLAY MAP
function initMap() {
  

  // console.log(currentMarker.position)
  map = new google.maps.Map(document.getElementById('map'), {
    map: map,
    draggable: true,
    position: {
      lat: 1.3521, 
      lng: 103.8198
    },
    zoom : 15
  });
 
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(card);
  infoWindow = new google.maps.InfoWindow;
  getCurrentLocation();
}
//FUNCTION TO GET THE LOCATION OF USER
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) { 
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      markerPlacement({
        pos :pos, 
        icon: iconMarker[0], 
        map: map,
        animation : google.maps.Animation.BOUNCE
      });
      map.setZoom(12); 
      map.setCenter(pos); 
      carparkInRadius(currentMarker[0].position.lat(),currentMarker[0].position.lng());
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
//AUTO COMPLETE FUNCTION - TO LET USER ENTER THEIR DESIRED LOCATION
function autoCompleteEntry() {
  var input = document.getElementById('search-location');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setComponentRestrictions(
    // LOCATION OF SEARCH RESTRICTED TO SINGAPORE
    { 'country': ['sg'] });
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name']);
  // var infowindow = new google.maps.InfoWindow();
  // GET THE SELECTED FROM THE DROP DOWN LIST BY INFO WINDOW (REQUIRED SINCE YOU NEED TO ALLOW USER TO SELECT FROM THE LIST)
  var infowindowContent = document.getElementById('infowindow-content');
  // SETTING THE MARKER/S TO BE PLACE ON MAP
  infoWindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map, //DISPLAY ON WHICH MAP
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', function() {
    // clearCurrentMarker();
    infoWindow.close();
    // GET AND STORE THE SEARCH INFORMATION
    var place = autocomplete.getPlace();
    // ERROR MESSAGE IF WRONG INFO ENTERED
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(12); 

    clearCurrentMarker();
    clearMarkerCluster();
    markerPlacement({
      pos : place.geometry.location,
      icon : iconMarker[0],
      map : map,
      animation : google.maps.Animation.BOUNCE
    })
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
    document.getElementById("search-location").value = "";

    currentMarker.push(marker)
    carparkInRadius(currentMarker[0].position.lat(),currentMarker[0].position.lng());
  })
}

//CREATE MARKER FUNCTION FOR CURRENT LOCATION
function markerPlacement(geoInfo) {
  var marker = new google.maps.Marker({
    map: geoInfo.map,
    draggable: false,
    icon : geoInfo.icon,
    position: geoInfo.pos
  });
  if (geoInfo.animation){
    marker.setAnimation(geoInfo.animation);
  }
  currentMarker.push(marker)
}
function markerCP(geoInfo) {
  var marker = new google.maps.Marker({
    map: geoInfo.map,
    draggable: false,
    icon : geoInfo.icon,
    position: geoInfo.pos
    
  });
  if (geoInfo.animation){
    marker.setAnimation(geoInfo.animation);
  }
  counter++;
  var infoWindow = new google.maps.InfoWindow({
    content : `<table class="table table-dark">
            <thead>
              <tr>
                <th scope="col" class="text-warning">${geoInfo.info.carpark_number}</th>
                <th>Info</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Distance from location</th>
                <td>${geoInfo.info.address}</td>
              </tr>
              <tr>
                <th scope="row">Lots available</th>
                <td>${geoInfo.info.lots_available}</td>
              </tr>
              <tr>
                <th scope="row">Carpark Type</th>
                <td>${geoInfo.info.car_park_type}</td>
              </tr>
              <tr>
                <th scope="row">Free Parking</th>
                <td>${geoInfo.info.free_parking}</td>
              </tr>
              <tr>
                <th scope="row">Distance from location</th>
                <td>${geoInfo.distance}</td>
              </tr>
            </tbody>
          </table>
          `
      });
      marker.addListener('click', function(){
          infoWindow.open(map,marker);
          map.setCenter(marker); 

  });
  markers.push(marker)
 
}

//FILTER THE CARPARKS WITHIN THE USER-SELECTED RADIUS
function carparkInRadius(lat, lng) {
  // var checker = [];
  // var i = 0;
  for (let item in carparkData) {
    var latPos = lat;
    var lngPos = lng;
    var latCP = carparkData[item].x_coord;
    var lngCP = carparkData[item].y_coord;
    var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP).toFixed(2)*1000; 
    if (distance <= radius && carparkData[item].lots_available >0) {
      var cp = {
        lat: latCP,
        lng: lngCP
      };
      markerCP({
        map : map,
        icon : iconMarker[1],
        pos : cp,
        animation : google.maps.Animation.DROP,
        info : carparkData[item],
        distance : distance
      })
     // SET INFOWINDOW FOR THE MARKER UPON CLICK
      
   
      // nearbyCarpark[i]=carparkData[item];
      // labels.push(carparkData[item].carpark_number); 
      // Object.assign( nearbyCarpark[i], { 'distance' : distance });
      // i++;
    }
      
  }
  console.log(markers)
  markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}
 
//FUNCTION TO REMOVE MARKERS
function clearCurrentMarker() {
  currentMarker.forEach(function(m) {
    m.setMap(null);
    // console.log(m)
  });
  currentMarker = [];
}
function clearMarkerCluster(){
  markers.forEach(function(m) {
    m.setMap(null);
    // console.log(m)
  });
  markers = [];

  if (markerCluster != undefined){
    markerCluster.clearMarkers(); 
  }

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
  $('#current-location').click(function() {
    clearCurrentMarker();
    clearMarkerCluster();
    $("#pac-container").hide();
    getCurrentLocation();
  }); 

  $("#find-location").click(function(){
    $("#pac-container").show();
    autoCompleteEntry();
  }); 
 
  $(".radius").click(function() {
    radius = $(this).val();
    clearMarkerCluster();
    carparkInRadius(currentMarker[0].position.lat(),currentMarker[0].position.lng());
  }); 
 
});

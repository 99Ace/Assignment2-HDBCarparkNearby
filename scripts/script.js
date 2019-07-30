/*global $ google setMapOnAll navigator axios*/
var map, infoWindow;
var service; //Load map for PlacesService
var locationSearch = {
  query: 'Zoo Singapore',
  fields: ['name', 'geometry'],
}; //for holding the data to set the map
var markers = [];


//GOOGLE MAP FUNCTIONS
//DISPLAY MAP
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 1.3521, lng: 103.8198 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;
  getCurrentLocation(1);
  autoCompleteEntry();
}
//FUNCTION TO GET THE LOCATION OF USER
function getCurrentLocation(radius) {
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
      
      carparkInRadius(radius, pos)
      // if (radius == 0) {
      //   for (let item in carparkData) {
      //     var latPos = pos.lat;
      //     var lngPos = pos.lng;
      //     var latCP = carparkData[item].x_coord;
      //     var lngCP = carparkData[item].y_coord;
      //     var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP);
      //     checker.push(distance);
      //     if (distance <= 0.5) {
      //       var cp = {
      //         lat: latCP,
      //         lng: lngCP
      //       };
      //       markerCarparks(cp, map);
      //     }
      //   }
      // }
      // if (radius == 1) {
      //   for (let item in carparkData) {
      //     var latPos = pos.lat;
      //     var lngPos = pos.lng;
      //     var latCP = carparkData[item].x_coord;
      //     var lngCP = carparkData[item].y_coord;
      //     var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP);
      //     checker.push(distance);
      //     if (distance <= 1) {
      //       var cp = {
      //         lat: latCP,
      //         lng: lngCP
      //       };
      //       markerCarparks(cp, map);
      //     }
      //   }
      // }
      // if (radius == 2) {
      //   for (let item in carparkData) {
      //     var latPos = pos.lat;
      //     var lngPos = pos.lng;
      //     var latCP = carparkData[item].x_coord;
      //     var lngCP = carparkData[item].y_coord;
      //     var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP);
      //     checker.push(distance);
      //     if (distance <= 2) {
      //       var cp = {
      //         lat: latCP,
      //         lng: lngCP
      //       };
      //       markerCarparks(cp, map);
      //     }
      //   }
      // }
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
function autoCompleteEntry(){
  var input = document.getElementById('place-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  // Set initial restrict to the greater list of countries.
  autocomplete.setComponentRestrictions(
    // LOCATION OF SEARCH RESTRICTED TO SINGAPORE
    {'country': ['sg']});
  // Specify only the data fields that are needed.
  autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);
      // 'address_components' - address of place searched
       // , 'geometry' - lat lng
      // 'icon' - icon 
      // 'name' - name of place searched
  // OPEN A NEW INFOWINDOW TO DISPLAY THE MARKER (COMPULSORY)
  var infowindow = new google.maps.InfoWindow();
  // GET THE SELECTED FROM THE DROP DOWN LIST BY INFO WINDOW (REQUIRED SINCE YOU NEED TO ALLOW USER TO SELECT FROM THE LIST)
  var infowindowContent = document.getElementById('infowindow-content');
  // SETTING THE MARKER/S TO BE PLACE ON MAP
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map, //DISPLAY ON WHICH MAP
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', function() {
      infowindow.close();
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
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(16);  // Why 17? Because it looks good.
      }
      
      marker.setPosition(place.geometry.location); // SETTING MARKER POSITION
      marker.setVisible(true);// MAKE MARKER VISIBLE TO DISPLAY ON MAP

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
      infowindow.open(map, marker);
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
  var icon = "https://img.icons8.com/color/48/000000/map-pin.png"
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: icon
    // title: 'Your location'
  });
  markers.push(marker);
}
// function createMarker(request, map) {
//   // var marker = new google.maps.Marker({
//   //   position: place.geometry.location,
//   //   map: map,
//   // });
//   // // SHOWS THE LOCATION DETAIL WHEN CLICK UPON
//   // google.maps.event.addListener(marker, 'click', function() {
//   //   infowindow.setContent(place.name);
//   //   infowindow.open(map, this);
//   // });

//   service.getDetails(place, function(place, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       var marker = new google.maps.Marker({
//         map: map,
//         position: place.geometry.location
//       });
//       google.maps.event.addListener(marker, 'click', function() {
//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
//           'Place ID: ' + place.place_id + '<br>' +
//           place.formatted_address + '</div>');
//         infowindow.open(map, this);
//       });
//     }
//   });


//   markers.push(marker);
// }
//FILTER THE CARPARKS WITHIN THE USER-SELECTED RADIUS
function carparkInRadius(radius, pos){
  let i = 0;
  let range = [0.5, 1, 2];
  var checker = [];
  while (i < 3){
    if (radius == i) {
      for (let item in carparkData) {
        var latPos = pos.lat;
        var lngPos = pos.lng;
        var latCP = carparkData[item].x_coord;
        var lngCP = carparkData[item].y_coord;
        var distance = getDistanceFromLatLonInKm(latPos, lngPos, latCP, lngCP);
        checker.push(distance);
        if (distance <= range[i]) {
          var cp = {
            lat: latCP,
            lng: lngCP
          };
          markerCarparks(cp, map);
        }
      }
    }
    i++;
  }
}
//CALCULATE THE RADIUS SET BY USER AND FILTERED THE CARPARKS THAT FULFIL THE SETTING
function carparksWithinRadius(radius){
  
}
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  }
  else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
//FUNCTION TO REMOVE MARKERS
function clearMarker() {
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}
//FUNCTION TO SEARCH FOR A LOCATION AND PLACE A MARKER


var dataSource = "https://api.data.gov.sg/v1/transport/carpark-availability";
var dataSource2 = "carparkdata.json";
var carparkData = [];
var latLngConverted;
var convertSV21

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

// alert (getDistanceFromLatLonInKm(1.3521, 103.8198, 1.3531,103.8198 ))

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
console.log(carparkData)

$(function() { //TO DETECT FOR CLICK FOR SEARCH & PLACE NEW MARKER
 
  //TO DETECT FOR 'ENTER' BY USER FOR SEARCH & PLACE NEW MARKER
  // $("#find-place").keyup(function() {
  //   if (event.keyCode === 13) {
  //     locationSearch.query = ($("#find-place").val()) + " Singapore";
  //     searchAndPlace(locationSearch);
  //     $("#find-place").val("");
  //   }
  // })
  //TO DETECT FOR CLICK FOR SUBMIT
  $('#current-location').click(function() {
    var radius = $('.search-drop').val();
    clearMarker();
    getCurrentLocation(radius);
  });
  //TO DETECT CHANGE IN DROP-DOWN SELECTION FOR THE RADIUS OF VIEW FOR NEARBY CARPARKS
  // $(".search-drop").change(function() {
  //     var v = $('.search-drop').val();
  //     if (v == 0){
  //       alert("500m");
  //     } 
  //     else if (v == 1){
  //       alert('1km')
  //     }
  //     else {
  //       alert('2km')
  //     }
  // });

  // $('#start').click(function(){
  //   $("#introduction").hide()
  //   $("#search-frame").fadeIn(500)
  // })
})

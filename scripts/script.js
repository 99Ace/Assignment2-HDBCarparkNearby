/*global $ google*/
var map, map2, infoWindow;
var service; //Load map for PlacesService
var locationSearch = {
  query: 'Singapore',
  fields: ['name', 'geometry'],
}; //for holding the data to set the map
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 1.3521, lng: 103.8198 },
    zoom: 13
  });
  map2 = new google.maps.Map(document.getElementById('map2'), {
    center: { lat: 1.3521, lng: 103.8198 },
    zoom: 18
  });
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);

  //Shows the current location of user else return error
  if (navigator.geolocation) {
    //get the location of the user current position
    navigator.geolocation.getCurrentPosition(function(position) { // get user position
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      infoWindow.setPosition(pos); // set the window to the location of user
      markerPlacement(pos, map) //set the marker to the location of the user, pos contains the lat and lng
      // markerPlacement(pos, map2) //set the marker to the location of the user, pos contains the lat and lng

      map.setCenter(pos); //Set the map to center to the position set in pos
      // map2.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // map.addListener('click', function(event) {
  //   clearMarkers();  
  //   addMarker(event.latLng);
  // });
}
//function to place marker of coordinates given
function markerPlacement(myLatLng, map) { //myLatLng to set location, map to set map to place marker
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    // title: 'Your location'
  })
  console.log(myLatLng);

  markers.push(marker);
}
function createMarker(place) {
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  console.log()
}
//Clear all Markers
function clearMarkers() {
  setMapOnAll(null);
}

//function to set window center to user location
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

var dataSource = "https://api.data.gov.sg/v1/transport/carpark-availability";
var dataSource2 = "carparkdata.json";
var data;
var carparkData = [],
  carparkData2 = []

// Axios function to get data from the api
function getDataFromEndpoint(callback) {
  axios.get(dataSource)
    .then(function(response) {
      // console.log(response)
      let result = response.data.items[0].carpark_data;
      // // console.log(result)
      callback(result)
    })
}
function getDataFromFile(callback) {
  axios.get(dataSource2)
    .then(function(response) {
      // console.log(response)
      let result = response.data;
      // console.log(result)
      callback(result) 
    })
}

// Calculate distance using Heversine Formula (courtesy from stackOverflow solution)
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
// alert (getDistanceFromLatLonInKm(1.3521, 103.8198, 1.3531,103.8198 ))

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// getDataFromEndpoint(function(data) {
//   let item
//   }
//   console.log(carparkData);
// })
getDataFromFile(function(carparkAddInfo){
  getDataFromEndpoint(function(data){
    for (let item in data) {
      carparkData[item] = {
        "carpark_number": data[item].carpark_number,
        "lot_type": data[item].carpark_info[0]["lot_type"],
        "lots_available": data[item].carpark_info[0]["lots_available"],
        "total_lots": data[item].carpark_info[0]["total_lots"]
      };
      for (let item2 in carparkAddInfo) {
        if (carparkAddInfo[item2].car_park_no == data[item].carpark_number) {
          Object.assign(carparkData[item], {
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
            "y_coord": carparkAddInfo[item].y_coord
          })

        }
      } //Working Set : Do not change
    }
  })
})
console.log(carparkData)


$(function() {
  // Get the input location from user
  $("#location-submit").click(function() {
    // clearMarkers();
    let userentry = ($("#search").val())
    locationSearch.query = userentry + " Singapore";

    service.findPlaceFromQuery(locationSearch, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
          // markerPlacement(results[i], map);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  })
})

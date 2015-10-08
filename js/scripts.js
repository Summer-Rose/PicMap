var map;
var markersArray = [];
var myLatLng;
var coordinates = [];

function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.09024, lng: -95.712891 }
  });
  randomLatLng();

  map.addListener("click", function (event) {
    deletePreviousMarker();
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    myLatLng = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
    });
    markersArray.push(marker);
    console.log("MarkersArray =" + markersArray);
  });

  var coords = randomLatLng();
  var lat = coords[0];
  var lng = coords[1];

  $(function() {
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + lng + "&distance=5000&client_id=ecc35f29ced04e06ab5ef5f75f8202b8",
      success: function(data) {
        if (data.data.length >= 5) {
          for (var i = 0; i < 20; i++) {
            $("#pics").append("<a target='_blank' href='" + data.data[i].link + "'><img class='insta' src='" + data.data[i].images.low_resolution.url + "'></img></a>");
          }
        } else {
          document.location.reload();
        }
      }
    });
  });
}

function deletePreviousMarker() {
  if (markersArray) {
  for (i in markersArray) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
  }
}

function randomLatLng() {
  var bounds = {
    north: 50.2116931,
    south: 25.9701932,
    east: -66.9732228,
    west: -123.9639528
  };
  var lngSpan = bounds.east - bounds.west;
  var latSpan = bounds.north - bounds.south;
  //var coordinates = [];
  var lat = bounds.south + latSpan * Math.random();
  var lng = bounds.west + lngSpan * Math.random();
  coordinates.push(lat);
  coordinates.push(lng);
  console.log(coordinates);
  return coordinates;
}

function calculateDifference() { //can later add unit as parameter
  if (markersArray.length > 0) {
    var R = 6371;
    var latGuess = markersArray[0].position.J;
    var lngGuess = markersArray[0].position.M;
    var latActual = coordinates[0];
    var lngActual = coordinates[1];
    var dLat = deg2rad(latActual-latGuess);
    var dLon = deg2rad(lngActual-lngGuess);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(latGuess)) * Math.cos(deg2rad(latActual)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c; // Distance in km
    return distance;
  }
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

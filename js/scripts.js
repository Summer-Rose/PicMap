var map;
var markersArray = [];
var myLatLng;
var coordinates = [];
var imageData;
var starIcon = 'img/star-icon.png';
var guessIcon = 'img/guess-icon.png';

function initialize() {
  coordinates = [];
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.09024, lng: -95.712891 }//center of us
  });
  randomLatLng();

  map.addListener("click", function (event) {
    deletePreviousMarker();
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    myLatLng = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({
      position: myLatLng,
      icon: guessIcon,
      map: map,
    });
    markersArray.push(marker);

    ///TEST
    var lineCoordinates = [
      {lat: coordinates[0], lng: coordinates[1]},
      myLatLng
    ];
    //console.log(lineCoordinates);
  });

  return coordinates;
}


function callImages() {
  initialize();
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://api.instagram.com/v1/media/search?lat=" + coordinates[0] + "&lng=" + coordinates[1] + "&distance=5000&client_id=ecc35f29ced04e06ab5ef5f75f8202b8",
      success: function(data) {
        if (data.data.length >= 5) {
           for (var i = 0; i < data.data.length; i++) {
             $("#pics").append("<a target='_blank' href='" + data.data[i].link + "'><img class='insta' src='" + data.data[i].images.low_resolution.url + "'></img></a>");
             $("#pics").show();
           }
         } else {
           callImages();
         }

    }
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
  //console.log(coordinates);
  return coordinates;
}

function calculateDifference() { //can later add unit as parameter
  //debugger;
  if (markersArray.length > 0) {
    addOriginalPin();
    var R = 6371;
    var latGuess = markersArray[0].getPosition().lat();
    var lngGuess = markersArray[0].getPosition().lng();
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
    return Math.round(distance);
  }
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function addOriginalPin() {
  var myLatLng = {lat: coordinates[0], lng: coordinates[1]}
  var marker = new google.maps.Marker({
    position: myLatLng,
    icon: starIcon,
    map: map,
  });
  addLine();
}

function addLine() {
  var lineCoordinates = [
    {lat: coordinates[0], lng: coordinates[1]},
    myLatLng
  ];
  var flightPath = new google.maps.Polyline({
    path: lineCoordinates,
    geodisc: true,
    strokeColor: '#000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
}

$(document).ready(function() {
  $("#guess").click(function() {
    if (markersArray.length > 0) {
      var distance = calculateDifference();
      if (sessionStorage.score) {
        sessionStorage.score = Number(sessionStorage.score) + distance;
      } else {
        sessionStorage.score = distance;
      }
      $("#distance").text("You were off by " + distance + " kilometers!");
      $("#score").text("Score: " + sessionStorage.score);
      $("#myModal").modal('show');
    } else {
      alert("Please make a guess by selecting a point on the map.");
    }
  });

  $("#next-round").click(function() {
    document.location.reload();
  });
  $("#new-game").click(function() {
    delete sessionStorage.score;
    document.location.reload();
  });
});

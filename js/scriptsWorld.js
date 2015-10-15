var map;
var markersArray = [];
var myLatLng;
var coordinates = [];
var imageData;
var starIcon = 'img/star-icon.png';
var guessIcon = 'img/guess-icon.png';
var ref = new Firebase("https://picmap.firebaseio.com/");

function initialize() {
  coordinates = [];
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.09024, lng: -5.712891 } //center of us
  });
  map.setOptions({ minZoom: 4, maxZoom: 15});
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
          //$("#pics").append("<a target='_blank' href='" + data.data[i].link + "'><img class='insta' src='" + data.data[i].images.low_resolution.url + "'></img></a>");
          $("#pics").append("<img class='insta' src='" + data.data[i].images.low_resolution.url + "'></img>");
          $("#pics").show();
          $("#loader").removeClass("loading");
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
    north: 68.9110048,
    south: -50.6250730,
    east: 166.640625,
    west: -167.34375
  };
  var lngSpan = bounds.east - bounds.west;
  var latSpan = bounds.north - bounds.south;
  var lat = bounds.south + latSpan * Math.random();
  var lng = bounds.west + lngSpan * Math.random();
  coordinates.push(lat);
  coordinates.push(lng);
  return coordinates;
}

function calculateDifference() { //can later add unit as parameter
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

function newGame() {
  delete sessionStorage.score;
  delete sessionStorage.roundsPlayed;
  document.location.reload();
}

function gameOver() {
  console.log('game over');
  delete sessionStorage.score;
  delete sessionStorage.roundsPlayed;
  window.location.replace("leaderboard.html");
}

function getRoundScore(distance) {
  var roundScore = 0;
  if (distance < 500) {
    roundScore+=10;
  } else if (distance > 500 && distance < 900) {
    roundScore+=9;
  } else if (distance > 900 && distance < 1300) {
    roundScore+=8;
  } else if (distance > 1300 && distance < 1700) {
    roundScore+=7;
  } else if (distance > 1700 && distance < 2100) {
    roundScore+=6;
  } else if (distance > 2100 && distance < 2500) {
    roundScore+=5;
  } else if (distance > 2500 && distance < 2900) {
    roundScore+=5;
  } else if (distance > 2900 && distance < 3300) {
    roundScore+=3;
  } else if (distance > 3300 && distance < 4200) {
    roundScore+=2;
  } else if (distance > 4200 && distance < 5000) {
    roundScore+=1;
  } else {
    roundScore+=0;
  }
  return roundScore;
}

$(document).ready(function() {
  $(window).on('load resize', function() {
    $("#map").width($(this).width());
    $(".bottomNav").width($(this).width());
    $("#map").height($(this).height() - 147);
  });

  if (sessionStorage.score === undefined){
    $(".currentScore").text("0");
  } else {
    $(".currentScore").text(sessionStorage.score)
  };

  if (sessionStorage.roundsPlayed === undefined){
    $(".currentRound").text("1");
  } else {
    var displayRound = Number(sessionStorage.roundsPlayed) + 1;
    $(".currentRound").text(displayRound)
  };


  $("#guess").click(function() {
    if (markersArray.length > 0) {
      var distance = calculateDifference();
      var roundScore = getRoundScore(distance);
      if (sessionStorage.score) {
        sessionStorage.score = Number(sessionStorage.score) + roundScore;
      } else {
        sessionStorage.score = roundScore;
      }
      if (sessionStorage.roundsPlayed) {
        sessionStorage.roundsPlayed = Number(sessionStorage.roundsPlayed) + 1;
      } else {
        sessionStorage.roundsPlayed = 1;
      }

      $("#distance").text("You were off by " + distance + " kilometers");
      $("#score").text("Points Earned: " + roundScore);
      if (sessionStorage.roundsPlayed < 5) {
        $("#next-round").show();
      } else {
        $("#game-over").text("Round Complete");
        $("#submit-score").show();
      }
      $("#myModal").modal('show');
    } else {
      alert("Please make a guess by selecting a point on the map.");
    }
  });

  $("#next-round").click(function() {
    document.location.reload();
  });
  $("#addScore").click(function() {
    debugger;
    var userName = $("#userName").val();
    var usersRef = ref.child("users");
    var userScore = sessionStorage.score;
    usersRef.push().set({
      name: userName,
      score: userScore
    });
    gameOver();
  });
  $("#new-game").click(function() {
    newGame();
  });
});

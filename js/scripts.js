var map;
var markersArray = [];

function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.09024, lng: -95.712891 }
  });
  randomLatLng();
  ///GET PHOTOS HERE
  map.addListener("click", function (event) {
    deletePreviousMarker();
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    var myLatLng = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
    });
    markersArray.push(marker);
    console.log( latitude + ', ' + longitude );
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
        for (var i = 0; i < 20; i++) {
          $("#pics").append("<a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.low_resolution.url + "'></img></a>");
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
  var coordinates = [];
  var lat = bounds.south + latSpan * Math.random();
  var lng = bounds.west + lngSpan * Math.random();
  coordinates.push(lat);
  coordinates.push(lng);
  console.log(coordinates);
  return coordinates;
}

// map.addListener('click', function() {
//   infowindow.open(marker.get('map'), marker);
// })

// // $(document).ready(function() {
// //
// // });

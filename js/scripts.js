function initialize() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.09024, lng: -95.712891 }
  });
  randomLatLng();
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

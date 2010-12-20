var map;
var infoWindow;

function request_vendors(current_location) {
  if (current_location) {
    var params = {'lat':current_location[0], 'lng': current_location[1], 'authenticity_token': AUTH_TOKEN};
    $.post('vendors/list.json', params, getMarkers, 'json')
  }
}

function findLocation() {
  if (navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      request_vendors([position.coords.latitude, position.coords.longitude]);
    });
  } else {
    if (google.gears) {
      browserSupportFlag = true;
      var geo = google.gears.factory.create('beta.geolocation');
      geo.getCurrentPosition(function(position) {
        request_vendors([position.coords.latitude, position.coords.longitude]);
      })
    } else {
      alert("Unable to determine location, geolocation is not available")
    }
  }
}

function addMarker(latitude, longitude, infoText, name) {
  var latlng = new google.maps.LatLng(latitude, longitude);
  var marker = new google.maps.Marker({position:latlng, map: map, title:name});
  google.maps.event.addListener(marker, 'click', function() {
      infoWindow.content = infoText;
      infoWindow.position = latlng;
      infoWindow.open(map, marker);
  });
  return marker;
}

function getMarkers(markers, statusString) {
  $('#waiting').hide();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    var current = markers[i].vendor;
    var markerText = createMarkerText(current.vendor, current.street);
    var marker = addMarker(current.lat, current.lng, markerText, current.vendor);
    bounds.extend(marker.getPosition());
    createLabelText(current, marker, markerText);
    map.fitBounds(bounds)
  }
}

function init() {
  var latlng = new google.maps.LatLng(37.75, -122.444);
  var myOptions = {
    zoom: 12,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map"), myOptions);
  infoWindow = new google.maps.InfoWindow({ content: '---' });
  findLocation();
}

function createMarkerText(vendor, address) {
  var h = document.createElement('h3');
  h.appendChild(document.createTextNode(vendor));
  var p = document.createElement('p');
  p.appendChild(h);
  p.appendChild(document.createTextNode(address));
  return p;
}

function createLabelText(vendor, marker, markerText) {
  var div = document.createElement('div');
  div.className = 'sidebar-label'
  var strong = document.createElement('strong');
  strong.appendChild(document.createTextNode(vendor.vendor));
  div.appendChild(strong);
  div.appendChild(document.createTextNode(' ' + vendor.street));

  div.onclick = function() {
    infoWindow.content = markerText;
    infoWindow.position = marker.position;
    infoWindow.open(map, marker);
  };
  document.getElementById('labels').appendChild(div);
}

window.onload = init;

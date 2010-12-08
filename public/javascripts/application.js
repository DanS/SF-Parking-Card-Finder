var map;
var centerLatitude = 37.75;
var centerLongitude = -122.444;
var startZoom = 12;
var markerHash = {};
var currentFocus = false;

function findLocation() {
  var output = null;
  if (navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      output = [ position.coords.latitude, position.coords.longitude]
    });
  }
  return output;
}

function addMarker(latitude, longitude, infoText) {
  var latlng = new GLatLng(latitude, longitude);
  var marker = new GMarker(latlng);
  GEvent.addListener(marker, 'click',
                    function(latlng) {
                      map.openInfoWindow(latlng, infoText)
                    }
      );
  map.addOverlay(marker);
  return marker;
}

function init() {
  map = new GMap($("map"));
  var markers;
  var location = findLocation();
  if (location) {
    var params = "lat=" + location[0] + "&lng=" + location[1] + '&authenticity_token=' + AUTH_TOKEN;
    var request = GXmlHttp.create();
    request.open('POST', 'vendors/list.json', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);
    request.setRequestHeader("Connection", "close");
    request.onreadystatechange = function() {

      if (request.readyState == 4) {
        $('waiting').hide()
        markers = eval( request.responseText);
        map.addControl(new GSmallMapControl());
        map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
        var bounds = new GLatLngBounds();
        for (var i = 0; i < markers.length; i++) {
          var current = markers[i].vendor;
          marker = addMarker(current.lat, current.lng, createMarkerText(current.vendor, current.street));
          bounds.extend(marker.getPoint());
          createLabelText(current);
        }
        map.setZoom(map.getBoundsZoomLevel(bounds));
        map.setCenter(bounds.getCenter());
      }
    };
    request.send(params);
  }
  else {
    alert('Sorry dude this browser does not support location')
  }
}

function createMarkerText(vendor, address) {
  var h = document.createElement('h3');
  h.appendChild(document.createTextNode(vendor));
  var p = document.createElement('p');
  p.appendChild(h);
  p.appendChild(document.createTextNode(address));
  return p;
}

function createLabelText(vendor) {
  var div = document.createElement('div');
  div.className = 'sidebar-label'
  var strong = document.createElement('strong');
  strong.appendChild(document.createTextNode(vendor.vendor));
  div.appendChild(strong);
  div.appendChild(document.createTextNode(' ' + vendor.street));
  div.onclick = function() {
    showInfoWindow(vendor)
  };
  document.getElementById('labels').appendChild(div);
}

function showInfoWindow(vendor) {
  var latlng = new GLatLng(vendor.lat, vendor.lng);
  var info = createMarkerText(vendor.vendor, vendor.street);
  map.openInfoWindowHtml(latlng, info);
}

window.onload = init;
window.onunload = GUnload;

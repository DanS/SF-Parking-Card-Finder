parkingCardApp = {
  'map':null,
  'infoWindow':null,

  'request_vendors': function(current_location) {
    var params;
    try { // don't use auth_token if its not there
      params = {'lat':current_location[0], 'lng': current_location[1], 'authenticity_token': AUTH_TOKEN};
    } catch(err) {
      console.log(err);
      params = {'lat':current_location[0], 'lng': current_location[1]};
    }
    $.post('vendors/list.json', params, parkingCardApp.getMarkers, 'json')
  },

  'findLocation': function() {
    if (navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        parkingCardApp.request_vendors([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      if (google.gears) {
        browserSupportFlag = true;
        var geo = google.gears.factory.create('beta.geolocation');
        geo.getCurrentPosition(function(position) {
          parkingCardApp.request_vendors([position.coords.latitude, position.coords.longitude]);
        })
      } else {
        alert("Unable to determine location, geolocation is not available")
      }
    }
  },

  'addMarker':function(latitude, longitude, infoText, name) {
    var latlng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({position:latlng, map: parkingCardApp.map, title:name});
    google.maps.event.addListener(marker, 'click', function() {
      parkingCardApp.infoWindow.content = infoText;
      parkingCardApp.infoWindow.position = latlng;
      parkingCardApp.infoWindow.open(parkingCardApp.map, marker);
    });
    return marker;
  },

  'getMarkers': function(markers) {
    $('#waiting').hide();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      var current = markers[i].vendor;
      var markerText = parkingCardApp.createMarkerText(current.vendor, current.street);
      var marker = parkingCardApp.addMarker(current.lat, current.lng, markerText, current.vendor);
      bounds.extend(marker.getPosition());
      parkingCardApp.createLabelText(current, marker, markerText);
      parkingCardApp.map.fitBounds(bounds)
    }
  },

  'init':function() {
    var latlng = new google.maps.LatLng(37.75, -122.444);
    var myOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    parkingCardApp.map = new google.maps.Map(document.getElementById("map"), myOptions);
    parkingCardApp.infoWindow = new google.maps.InfoWindow({ content: '---' });
    parkingCardApp.findLocation();
  },

  'createMarkerText': function(vendor, address) {
    var h = document.createElement('h3');
    h.appendChild(document.createTextNode(vendor));
    var p = document.createElement('p');
    p.appendChild(h);
    p.appendChild(document.createTextNode(address));
    return p;
  },

  'createLabelText': function(vendor, marker, markerText) {
    var div = document.createElement('div');
    div.className = 'sidebar-label';
    var strong = document.createElement('strong');
    strong.appendChild(document.createTextNode(vendor.vendor));
    div.appendChild(strong);
    div.appendChild(document.createTextNode(' ' + vendor.street));

    div.onclick = function() {
      parkingCardApp.infoWindow.content = markerText;
      parkingCardApp.infoWindow.position = marker.position;
      parkingCardApp.infoWindow.open(parkingCardApp.map, marker);
    };
    document.getElementById('labels').appendChild(div);
  }
};
window.onload = parkingCardApp.init;

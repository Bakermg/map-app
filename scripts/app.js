 function ViewModel() {
  var self = this;
  var map, city, infowindow;

  this.activeEvents = ko.observable([]); //List of events
  this.mapMarkers = ko.observable([]); //All Map Marker
  this.filterlist = ko.observable([]); //Filtered list
  this.numberOfEvents = ko.computed(function() {
    return self.filterlist().length;
  });


//Error handling if Google Maps fails to load
  this.mapRequestTimeout = setTimeout(function() {
    $('#map-canvas').html('Google Maps failed to load Please refresh your browser.');
  }, 8000);

// Initialize Google map
 function initMap() {

    // Some custom styling for the map
    var styles = [{
        "featureType": "administrative",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "water",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "transit",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "landscape",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road.highway",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road.local",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "water",
        "stylers": [{
            "color": "#84afa3"
        }, {
            "lightness": 52
        }]
    }, {
        "stylers": [{
            "saturation": -77
        }]
    }, {
        "featureType": "road"
    }];


     city = new google.maps.LatLng(26.09951, -80.38377);
     map = new google.maps.Map(document.getElementById('map'), {
        center: city,
        zoom: 11,
        styles: styles,
        mapTypeControl: false
    });

      clearTimeout(self.mapRequestTimeout);

  // found stackoverflow trick to re-center map and make responsive

    google.maps.event.addDomListener(window, "resize" , function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });

     infowindow = new google.maps.InfoWindow({maxWidth: 300});

}

// Use API to get events data
  function getEvents(location) {
    var activeURL = "http://api.amp.active.com/v2/search?query=running&category=event&radius=50&zip="+zip+"&start_date="+date+"api_key=uq2yyhkfewq9j2te9j754g6g";
  }

  initMap();
}

ko.applyBindings(new ViewModel());

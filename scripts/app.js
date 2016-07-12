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

    //Create a new map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 26.09951,
            lng: -80.38377
        },
        zoom: 12,
        styles: styles,
        mapTypeControl: false,
        panControl: false
    });

    var largeInfowindow = new google.maps.InfoWindow();

    var mapMarkers = new google.maps.Marker(
      {
        map: map,
        position: position,
        title: title,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP,
        id:  i
      }
    );
}

var ViewModel = function () {
  var self = this;

  this.mapMarkers = ko.observable([]);
  this.filterlist = ko.observable([]);
}
ko.applyBindings(new ViewModel());

// Some custom styling for the map
var styles = [{
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.local",
    "elementType": "all",
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
    "elementType": "all",
    "stylers": [{
        "color": "#84afa3"
    }, {
        "lightness": 52
    }]
}, {
    "featureType": "all",
    "elementType": "all",
    "stylers": [{
        "saturation": -17
    }, {
        "gamma": 0.36
    }]
}, {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
        "color": "#3f518c"
    }]
}];


// maker the marker a custom color from Udacity google maps course
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}



// Initial list of locations, The Model
  var initialLocations = [{
        name: "Fort Lauderdale Beach Park",
        latLng: {
            lat: 26.1120152,
            lng: -80.1048193
        },
        streetAddress: "1100 Seabreaze Blvd",
        city: "Fort Lauderdale",
        zipcode: 33316,
        cat: "park",
        visable: true,
        icon: defaultIcon
    }, {
        name: "Markham Park Moutain Bike Trails",
        latLng: {
            lat: 26.1296413,
            lng: -80.3545787
        },
        streetAddress: "16001 W State Rd 84",
        city: "Sunrise",
        zipcode: 33326,
        cat: "park",
        visable: true,
        icon: defaultIcon
    }, {
        name: "Vista View Park",
        latLng: {
            lat: 26.070546,
            lng: -80.342975
        },
        streetAddress: "4001 SW 142nd Ave",
        city: "Davie",
        zipcode: 33330,
        cat: "park",
        visable: true,
        icon: defaultIcon
    }, {
        name: "Graciano's",
        latLng: {
            lat: 26.097359,
            lng: -80.381417
        },
        streetAddress: "1721 Main St",
        city: "Weston",
        zipcode: 33326,
        cat: "food",
        visable: true,
        icon: defaultIcon
    }, {
        name: "Vienna Cafe",
        latLng: {
            lat: 26.1033643,
            lng: -80.2706109
        },
        streetAddress: "9100 W State Rd",
        city: "Davie",
        zipcode: 33324,
        cat: "food",
        visable: true,
        icon: defaultIcon
    }, {
        name: "Sawgrass Mills Mall",
        latLng: {
            lat: 26.150166,
            lng: -80.324821
        },
        streetAddress: "12801 W Sunrise Blvd",
        city: "Sunrise",
        zipcode: 33323,
        cat: "shopping",
        visable: true,
        icon: defaultIcon
    }, {
        name: "Fort Lauderdale Hollywood Airport",
        latLng: {
            lat: 26.07428482,
            lng:-80.15067101
        },
        streetAddress: "100 Terminal Dr",
        city: "Fort Lauderdale",
        zipcode: 33315,
        cat: "airport",
        visable: true,
        icon: defaultIcon
    }, {
        name: "The Shops At Pembroke Gardens",
        latLng: {
            lat: 26.00470497,
            lng: -80.33688068
        },
        streetAddress: "527 SW 145th Terrace",
        city: "Pembroke Pines",
        zipcode: 33027,
        cat: "shopping",
        visable: true,
        icon: defaultIcon
    }
];
//create a custom colored marker from Udacity google maps course
var defaultIcon = makeMarkerIcon('0091ff');


var Location = function(data) {
    //Create markers from the data
    this.marker = new google.maps.Marker({
        title: data.name,
        position: data.latLng,
        address: data.streetAddress,
        city: data.city,
        icon: defaultIcon,
        Animation: google.maps.Animation.DROP,
        visable: true,
        cat: data.cat
    });
    //Create an infowindow for each location
    this.infoWindow = new google.maps.InfoWindow({ maxWidth: 400 });
};

Location.prototype.toggle = function() {
    if(this.marker.getAnimation() === null) {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
    } else {
      this.marker.setAnimation(null);
    }
    this.infoWindow.open();
};

Location.prototype.stopToggle = function() {
  this.marker.setAnimation(null);
  this.infoWindow.close();
};


var ViewModel = function() {

    var self = this;
    var map;
    var clickedItem = null;
    this.locationList = ko.observableArray([]);
    this.search = ko.observable('');
    self.yahooQuery = ko.observableArray([]);

    //Set timeout to handle google maps error
    this.mapRequestTimeout = setTimeout(function() {
        $('#map').html('Google Maps failed to load Please refresh your browser.');
    }, 8000);




    initialLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));

    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        styles: styles,
        center: { lat: 26.1033643, lng: -80.2706109 },
        mapTypeControl: false
    });

    //clear timeout once map has rendered
    clearTimeout(self.mapRequestTimeout);

    //Map center button function to get back to center
    this.centerMap = function() {
        var centerCity = new google.maps.LatLng(26.1033643, -80.2706109);
        map.panTo(centerCity);
        map.setZoom(11);
    };

    google.maps.event.addDomListener(window, "resize", function() {
        center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    this.locationList().forEach(function(locItem) {

        locItem.marker.setMap(map);

        locItem.marker.addListener('click', function() {
          if(clickedItem !== null) {
            clickedItem.stopToggle();
            clickedItem.infoWindow.close();
          }
            locItem.toggle();
            locItem.infoWindow.open(map, locItem.marker);
            getLocalList();

            clickedItem = locItem;
            map.panTo(locItem.marker.position);
            locItem.marker.setMap(map);
        });

        var contentString = '<div><img border="0" align="left" src="https://www.flickr.com/photos/94639255@N00/29105332662"></div>';
        locItem.infoWindow.setContent(contentString);
        locItem.infoWindow.addListener('closeclick' , function() {
          locItem.stopToggle();
        });
  });

    self.bounce = function (locItem) {
    if (clickedItem !== null) {
      clickedItem.stopToggle();
      self.yahooQuery.removeAll();
      locItem.infoWindow.close();
    }
    locItem.toggle();
    locItem.infoWindow.open(map, locItem.marker);
    getLocalList(locItem);
    console.log(dataList);
    clickedItem = locItem;

    // pan to the clicked marker
    map.panTo(locItem.marker.position);
    locItem.marker.setMap(map);
    };

    //Get local info for the place clicked from yahoo local api

    function getLocalList(locItem) {

        self.yahooQuery.removeAll();
       // var yahooRequestTimeout = setTimeout(function () {
         // self.yahooQuery[0] ("Request failed try agian");
        //})

        var localURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c9023708225bd2bb6602b8bd8d8deeb7&accuracy=1&safe_search=1&content_type=1&lat="+locItem.maker.lat+"&lon="+locItem.marker.lon +"&radius=1&per_page=10&format=json&nojsoncallback=1&auth_token=72157672966982885-0fdeadd6687c64d2&api_sig=cd881cd734eaf3195342a51299002a1a";

        $.ajax({
                type: "GET",
                url: localURL,
                dataType: "jsonp",
            })
            .done(function(data) {
                var len = data.query.results.Result.length;
                for (var i = 0; i < len; i++) {
                    var dataList = data.query.results.Result[i].Title;

                }
            });

    }
}

ko.applyBindings(new ViewModel());

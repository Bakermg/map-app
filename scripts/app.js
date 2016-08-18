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


//Get local info for the place clicked from yahoo local api

function getLocalList(city, search) {
    var localURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20zip%3D'" + city + "'%20and%20query%3D'" + search + "'&format=json&diagnostics=true";

    $.ajax({
            type: "GET",
            url: localURL,
            dataType: "jsonp",
            //jsonp: "callBack",
        })
        .done(function(data) {
            var len = data.query.results.Result.length;
            for (var i = 0; i < len; i++) {
                var dataList = data.query.results.Result[i].Title;
                var mylat = data.query.results.Result[i].Latitude;
                var myLon = data.query.results.Result[i].Longitude;
                var markerPostion = { lat: parseFloat(mylat), lng: parseFloat(myLon) };
            }
        });

}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}



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
        visable: true
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
        visable: true
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
        visable: true
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
        visable: true
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
        visable: true
    }, {
        name: "Sawgrass Mills Mall",
        latLng: {
            lat: 26.150166,
            lng: -80.324821
        },
        streetAddress: "Sawgrass Mills Cir",
        city: "Sunrise",
        zipcode: 33323,
        cat: "shopping",
        visable: true
    }, {
        name: "Fort Lauderdale Hollywood Airport",
        latLng: {
            lat: 26.07428482,
            lng: -80.15067101
        },
        streetAddress: "100 Terminal Dr",
        city: "Fort Lauderdale",
        zipcode: 33315,
        cat: "airport",
        visable: true
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
        visable: true
    }

];

var defaultIcon = makeMarkerIcon('0091ff');
var highlightedIcon = makeMarkerIcon('ffff24');

var Location = function(data) {
    //Create markers from the data
    this.marker = new google.maps.Marker({
        title: data.name,
        postion: data.latLng,
        address: data.streetAddress,
        icon: defaultIcon,
        Animation: google.maps.Animation.DROP,
        visable: true,
    });
    //Create an infowindow for each location
    this.infoWindow = new google.maps.InfoWindow({ maxWidth: 300 });
};


var ViewModel = function() {

    var self = this;
    var map;
    self.locationList = ko.observableArray([]);

    this.mapRequestTimeout = setTimeout(function() {
        $('#map').html('Google Maps failed to load Please refresh your browser.');
    }, 8000);

    this.centerMap = function() {
        var centerCity = new google.maps.LatLng(26.1033643, -80.2706109);
        map.panTo(centerCity);
        map.setZoom(11);
    };


    initialLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        styles: styles,
        center: { lat: 26.1033643, lng: -80.2706109 },
        mapTypeControl: false
    });

    clearTimeout(self.mapRequestTimeout);

    google.maps.event.addDomListener(window, "resize", function() {
        center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    self.locationList().forEach(function(locItem) {

        locItem.marker.setMap(map);

        locItem.marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });

        locItem.marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon)
        });

        locItem.marker.addListener('click', function() {
            locItem.infoWindow.open(map, locItem.marker);
            map.panTo(locItem.marker.position);
            locItem.marker.setMap(map);
        });

        var contentString = '<h3>' + locItem.marker.name + '</h3>' + locItem.marker.streetAddress + '<br>' + '<h3>' + locItem.marker.cat + '</h3>';
        locItem.infoWindow.setContent(contentString);
    });


};

getLocalList(33330, "Vista View Park");


ko.applyBindings(new ViewModel());

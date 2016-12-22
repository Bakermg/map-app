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


// make the marker a custom color from Udacity google maps course
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
    tags: "ft lauderdale beach",
    visible: true,
    icon: defaultIcon
}, {
    name: "Markham Park",
    latLng: {
        lat: 26.1296413,
        lng: -80.3545787
    },
    streetAddress: "16001 W State Rd 84",
    city: "Sunrise",
    zipcode: 33326,
    tags: "mountain biking",
    visible: true,
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
    tags: "vista view park",
    visible: true,
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
    tags: " garciano empanada",
    visible: true,
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
    tags: "vienna cafe",
    visible: true,
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
    tags: "sawgrass mall",
    visible: true,
    icon: defaultIcon
}, {
    name: "Fort Lauderdale Hollywood Airport",
    latLng: {
        lat: 26.07428482,
        lng: -80.15067101
    },
    streetAddress: "100 Terminal Dr",
    city: "Fort Lauderdale",
    zipcode: 33315,
    tags: "ft lauderdale airport",
    visible: true,
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
    tags: "shops at pembroke gardens",
    visible: true,
    icon: defaultIcon
}];
//create a custom colored marker from Udacity google maps course
var defaultIcon = makeMarkerIcon('0091ff');


var Location = function (data) {
    //Create markers from the data
    this.marker = new google.maps.Marker({
        title: data.name,
        position: data.latLng,
        address: data.streetAddress,
        city: data.city,
        icon: defaultIcon,
        Animation: google.maps.Animation.DROP,
        visible: true,
        tags: data.tags,
        lat: data.latLng.lat,
        lng: data.latLng.lng
    });
    //Create an infowindow for each location
    this.infoWindow = new google.maps.InfoWindow({
        maxWidth: 300
    });
};

// toggle the animation and infowindow
Location.prototype.toggle = function () {
    if (this.marker.getAnimation() === null) {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
    } else {
        this.marker.setAnimation(null);
    }
    this.infoWindow.open();
};

Location.prototype.stopToggle = function () {
    this.marker.setAnimation(null);
    this.infoWindow.close();
};


var ViewModel = function () {

    var self = this;
    var map;
    var clickedItem = null;
    var flickrSrc = " ";
    self.locationList = ko.observableArray([]);
    self.search = ko.observable('');
    self.flickrImg = ko.observableArray([]);

    //Set timeout to handle google maps error
    this.mapRequestTimeout = setTimeout(function () {
        $('#map').html('Google Maps failed to load Please refresh your browser.');
    }, 8000);




    initialLocations.forEach(function (locationItem) {
        self.locationList.push(new Location(locationItem));

    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        styles: styles,
        center: {
            lat: 26.1033643,
            lng: -80.2706109
        },
        mapTypeControl: false
    });

    //clear timeout once map has rendered
    clearTimeout(self.mapRequestTimeout);

    //Map center button function to get back to center
    this.centerMap = function () {
        var centerCity = new google.maps.LatLng(26.1033643, -80.2706109);
        map.panTo(centerCity);
        map.setZoom(10);
    };

    google.maps.event.addDomListener(window, "resize", function () {
        center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    self.locationList().forEach(function (locItem) {

        locItem.marker.setMap(map);

        locItem.marker.addListener('click', function () {
            if (clickedItem !== null) {
                clickedItem.stopToggle();
                clickedItem.infoWindow.close();
            }
            locItem.toggle();
            locItem.infoWindow.open(map, locItem.marker);
            getLocalFlickr(locItem);

            clickedItem = locItem;
            map.panTo(locItem.marker.position);
            locItem.marker.setMap(map);
        });

        var contentString = '<div id="iw-contianer">' +
            '<header class="iw-title">' + '<h3>' + locItem.marker.title + '</h3>' + '</header>' + flickrSrc + '</div>';
        locItem.infoWindow.setContent(contentString);
        //console.log(contentString);

        locItem.infoWindow.addListener('closeclick', function () {
            locItem.stopToggle();
            self.flickrImg.removeAll();
        });
    });

    self.bounce = function (locItem) {
        if (clickedItem !== null) {
            clickedItem.stopToggle();
            self.flickrImg.removeAll();
            locItem.infoWindow.close();
        }
        locItem.toggle();
        locItem.infoWindow.open(map, locItem.marker);
        getLocalFlickr(locItem);
        clickedItem = locItem;

        // pan to the  marker
        map.panTo(locItem.marker.position);
        locItem.marker.setMap(map);
    };

    //Get local img for the place clicked from flickr api

    function getLocalFlickr(locItem) {

        self.flickrImg.removeAll();
        //console.log(locItem.marker.lat);
        //console.log(locItem.marker.lng);
    
        //flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=fc762e4eaace125f6f9cccf69fc6d5b2&accuracy=1&safe_search=1&privacy_filter=1&accuracy=16&content_type=1&lat=" + locItem.marker.lat + "&lon=" + locItem.marker.lng + "&radius=1&radius_unit=km&per_page=10&//format=json&jsoncallback=?";
        var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickerAPI,{
                tags: locItem.marker.tags,
                tagmode: "any",
                format: "json"
                
            })
            .done(function (data) {
                //console.log(data);
                //var len = data.photos.photo.length;
                //for (var i = 0; i < len; i++) {
                    //var imgListId = data.photos.photo[2].id;
                    //var imgListOwner = data.photos.photo[2].owner;
                    //console.log(imgListId);
                    //console.log(imgListId);
                    //flickrSrc = '<img src="https://www.flickr.com/photos/' + imgListOwner + '/' + imgListId + '" >'
                    //console.log(flikrSrc);
                    //$.each(data.photos.photo, function(i, item){
                        //console.log(item.id);
                        //console.log(item.owner);
                        //var flickrImgSrc ="https://www.flickr.com/photos/"+item.owner+"/"+item.id;
                        var flickrImgsrc = data.items[5].media.m;
                        $("<img>").attr("src",flickrImgsrc).appendTo("#iw-contianer");
                        //if (i == 0) {
                            //return false;
                        //}
                    //})
            }) 
                
            
            
    }

    self.filter = function () {
        self.locationList().forEach(function (locItem) {
            if (self.search() === '' || locItem.marker.title.toLowerCase().indexOf(self.search().toLowerCase()) >= 0) {
                locItem.marker.setVisible(true);
            } else {
                locItem.stopToggle();
                locItem.marker.setVisible(false);
                if (locItem == clickedItem) {
                    self.flickrImg.removeAll();
                }
            }
        });

        var visableList = ko.observable(self.locationList());
        self.locationList([]);
        for (var i = 0; i < visableList().length; i++) {
            self.locationList.push(visableList()[i]);
        }
    };
}

ko.applyBindings(new ViewModel());
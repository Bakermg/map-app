
    var map, infowindow, title, pos;
    var myLatLng;
    var area;
    var city;
    var search;
    var markers = [];

    //Error handling if Google Maps fails to load
        this.mapRequestTimeout = setTimeout(function() {
            $('#map').html('Google Maps failed to load Please refresh your browser.');
        }, 8000);


    // Initialize Google map
    function initMap() {
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

        //create new map with initial location
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            styles: styles,
            center: {lat: 26.08207118, lng: -80.05943298},
            mapTypeControl: false
        });

         google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });


         var largeInfowindow = new google.maps.InfoWindow();




      var defaultIcon = makeMarkerIcon('0091ff');

      var highlightedIcon = makeMarkerIcon('ffff24');
      var self = this;
      for (var i = 0; i < initialLocations.length; i++) {
          var position = initialLocations[i].location;
          //var title = topiclocations[i].title;

          var marker = new google.maps.Marker({
              map: map,
              position: position,
              icon: defaultIcon,
              animation: google.maps.Animation.DROP,
              id: i
          });

          markers.push(marker);

          marker.addListener('click', function() {
              populateInfoWindow(this, largeInfowindow);
          });

          marker.addListener('mouseover', function() {
              this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
              this.setIcon(defaultIcon)
          });

  }
  clearTimeout(self.mapRequestTimeout);
}

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        })


        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.name + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    postion: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.name + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }

        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}


  //Get local info for the place clicked from yahoo local api

    function getLocalList(city, search) {
        var localURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20zip%3D'" + city + "'%20and%20query%3D'" + search + "'&format=json&diagnostics=true";

        $.ajax({
            type: "GET",
            url: localURL,
            dataType: "jsonp",
            //jsonp: "callBack",
          })
            .done (function(data) {
              var len = data.query.results.Result.length;
              for (var i = 0; i < len; i++) {
                var dataList = data.query.results.Result[i].Title;
                var mylat = data.query.results.Result[i].Latitude;
                var myLon = data.query.results.Result[i].Longitude;
                var markerPostion = {lat: parseFloat(mylat), lng: parseFloat(myLon)};
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



var initialLocations = [
        {
          name: "Fort Lauderdale Beach Park",
          location: {
            lat: 26.1120152,
            lng: -80.1048193
          },
          streetAddress: "1100 Seabreaze Blvd",
          city: "Fort Lauderdale",
          zipcode: 33316,
          cat: "park"
        },
        {
          name: "Markham Park Moutain Bike Trails",
          location: {
            lat: 26.1296413,
            lng: -80.3545787
          },
          streetAddress: "16001 W State Rd 84",
          city: "Sunrise",
          zipcode: 33326,
          cat: "park"
        },
        {
          name: "Vista View Park",
          location: {
            lat: 26.070546,
            lng: -80.342975
          },
          streetAddress: "4001 SW 142nd Ave",
          city: "Davie",
          zipcode: 33330,
          cat: "park"
        },
         {
            name: 'Graciano',
            location: {
                lat: 26.097359,
                lng: -80.381417
            },
            streetAddress: "1721 Main St",
            city: "Weston",
            zipcode: 33326,
            cat: "food"
        },
        {
          name: "Vienna Cafe",
          location: {
            lat: 26.1033643,
            lng: -80.2706109
          },
          streetAddress: "9100 W State Rd",
          city: "Davie",
          zipcode: 33324,
          cat: "food"
        },
        {
          name: "Sawgrass Mills Mall",
          location: {
            lat: 26.150166,
            lng: -80.324821
          },
          streetAddress: "Sawgrass Mills Cir",
          city: "Sunrise",
          zipcode: 33323,
          cat: "shopping"
        },
        {
          name: "Fort Lauderdale Hollywood Airport",
          location: {
            lat: 26.07428482,
            lng: -80.15067101
          },
          streetAddress: "100 Terminal Dr",
          city: "Fort Lauderdale",
          zipcode: 33315,
          cat: "airport"
        },
        {
          name: "The Shops At Pembroke Gardens",
          location: {
            lat: 26.00470497,
            lng: -80.33688068
          },
          streetAddress: "527 SW 145th Terrace",
          city: "Pembroke Pines",
          zipcode: 33027,
          cat: "shopping"
        }

    ];

var Location = function(data) {
  this.name = data.name;
  this.zipcode = data.zipcode;
  this.location = data.location;
  this.streetAddress = data.streetAddress;
  this.city = data.city;
  this.cat = data.cat;
}

var ViewModel = function() {
  var self = this;

  this.centerMap = function() {
    var centerCity = new google.maps.LatLng(26.08207118, -80.05943298);
    map.panTo(centerCity);
    map.setZoom(11);
  };

  this.markers = ko.observable([]);
  this.locationList = ko.observableArray([]);

  initialLocations.forEach(function(locationItem) {
    self.locationList.push(new Location(locationItem));
  });

  this.currentLocation = ko.observable(this.locationList()[0]);


  this.setLocation = function(clickedLocation) {
    self.currentLocation(clickedLocation);
  };


initMap();
}



ko.applyBindings(new ViewModel());

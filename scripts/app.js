function ViewModel() {

    var self = this;
    var map, infowindow, title, pos;
    var myLatLng;
    var area;
    var city;
    var search;


    this.activeEvents = ko.observable([]); //List of events
    this.activeStatus = ko.observable('Searching near you');
    this.mapMarkers = ko.observable([]); //All Map Marker
    this.filterlist = ko.observable([]); //Filtered list
    this.local = ko.observable(26.09951, -80.38377);
    this.numberOfEvents = ko.computed(function() {
        //return self.filterlist().length;
    });


    var topicLocation = [];
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

        //create new map with inintail location

        //city = new google.maps.LatLng(26.09951, -80.38377);
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            styles: styles,
            center: {lat: 38.906830, lng: -77.038599},
            mapTypeControl: false
        });

        var infoWindow = new google.maps.InfoWindow({map: map});

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var city = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(city);
            infoWindow.setContent('Location found.');
            map.setCenter(city);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });


        clearTimeout(self.mapRequestTimeout);

      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }

      function drop() {
          //clearMarkers();
          for (var i = 0; i < topicLocation.length; i++) {
            addMarkerWithTimeout(topicLocation[i], i * 200);
          }
        }

        function addMarkerWithTimeout(position, timeout) {
          window.setTimeout(function() {
            markers.push(new google.maps.Marker( {
              position: position,
              map: map,
              animation: google.maps.Animation.DROP
            }));
          }, timeout);
        }




    // Use API to get search local data
    document.getElementById('submit').addEventListener('click', function() {
        //city = $('#address').value;
        //search = $('#query').value;
        //alert(city, search);
    });

    //var myLatLng;

    function getEvents(city, search) {
        var localURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20zip%3D'" + city + "'%20and%20query%3D'" + search + "'&format=json&diagnostics=true";
        alert(localURL);


        $.ajax({
            type: "GET",
            url: localURL,
            dataType: "jsonp",
            //jsonp: "callBack",
            success: function(data) {
                var dataList = data.query.results.Result[0].Title;
                var mylat = data.query.results.Result[0].Latitude;
                var myLon = data.query.results.Result[0].Longitude;
                var markerPostion = {lat: parseFloat(mylat), lng: parseFloat(myLon)};

                //myLatLng = markerPostion;
                //console.log(markerPostion);
                //alert(dataList);
                topicLocation.push(markerPostion);
            }

        });

    }

    initMap();
    drop();
    getEvents("33327", "running");
}



ko.applyBindings(new ViewModel());

function ViewModel() {

    var self = this;
    var map, infowindow, title, pos;
    var myLatLng;
    var area;
    var city;
    var search;

    this.topicTitles = ko.observable([]);
    this.mapMarkers = ko.observable([]); //All Map Marker
    this.topicLocation = ko.observable([]);

    console.log(self.topicLocation);
    console.log(self.topicTitles);
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
            center: {lat: 26.09951, lng: -80.38377},
            mapTypeControl: false
        });



        //var infoWindow = new google.maps.InfoWindow({map: map});

        //Geolocation to find users local to center map
        /*if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var city = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            //infoWindow.setPosition(city);
            //infoWindow.setContent('You are here.');
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
        infoWindow.setPosition(city);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }*/


      var defaultIcon = makeMarkerIcon('0091ff');

      var highlightedIcon = makeMarkerIcon('ffff24');

      for (var i = 0; i < self.topicLocation.length; i++) {
          var position = self.topiclocations[i].location;
          //var title = topiclocations[i].title;

          var marker = new google.maps.Marker({
              map: map,
              position: position,
              //title: title,
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


    // Use API to get search local data
    //document.getElementById('submit').addEventListener('click', function() {
       // city = $('#address').value;
        //search = $('#query').value;
        //alert(city, search);
    //});

    function getEvents(city, search) {
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

                myLatLng = markerPostion;
                self.topicLocation.push({
                  lat: mylat,
                  lng: myLon
                });
                self.topicTitles.push({
                  queryLocation: datalist
                });
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

    console.log(this.topicTitles);
    //console.log(topicLocation);
    initMap();
    getEvents("33327", "running");

}



ko.applyBindings(new ViewModel());

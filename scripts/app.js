function ViewModel() {

    var self = this;
    var map, infowindow, myLatLng, title, pos;
    var area;
    var city;
    var search;

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

        //Error handling if Google Maps fails to load
        this.mapRequestTimeout = setTimeout(function() {
            $('#map-canvas').html('Google Maps failed to load Please refresh your browser.');
        }, 8000);


        //create new map with inintail location
        city =  {lat: 26.09951, lng: -80.38377} ;
        //var city = showLocation();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            styles: styles,
            center: city,//{lat: 26.09951, lng: -80.38377},
            mapTypeControl: false
        });

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          animation: google.maps.Animation.DROP
        });
        //var InfoWindow = new google.maps.InfoWindow({map: map});

       /*function showLocation() {
          navigator.geolocation.getCurrentPosition(function(position) {
             city = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            alert(city);
            map.setCenter(city);
          });
          console.log(city);
        }
*/
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });


    clearTimeout(self.mapRequestTimeout);
}


    this.activeEvents = ko.observable([]); //List of events
    this.activeStatus = ko.observable('Searching for events near you');
    this.mapMarkers = ko.observable([]); //All Map Marker
    this.filterlist = ko.observable([]); //Filtered list
    this.local = ko.observable(26.09951, -80.38377);
    this.numberOfEvents = ko.computed(function() {
        //return self.filterlist().length;
    });



    // Use API to get search local data
    document.getElementById('submit').addEventListener('click', function() {
        city = $('#address').value;
        search = $('#query').value;
        alert(city, search);
    });


    function getEvents(city, search) {
        var localURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20zip%3D'" + city + "'%20and%20query%3D'" + search + "'&format=json&diagnostics=true";
        alert(localURL);


        $.ajax({
            type: "GET",
            url: localURL,
            dataType: "jsonp",
            //jsonp: "callBack",
            success: function(data) {
                var dataList = data.query.results.Result[0].ClickUrl;
                var mylat = data.query.results.Result[0].Latitude;
                var myLon = data.query.results.Result[0].Longitude;
                var markerPostion = {lat: mylat, lng: myLon};
                myLatLng = markerPostion;
                alert(markerPostion);
                alert(dataList);

            }
        });
    }










    initMap();
    getEvents("33327", "running");
}



ko.applyBindings(new ViewModel());

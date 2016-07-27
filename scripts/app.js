function ViewModel() {

  var self = this;
  var map, infowindow, area, city, search;

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

    //Error handling if Google Maps fails to load
     this.mapRequestTimeout = setTimeout(function() {
       $('#map-canvas').html('Google Maps failed to load Please refresh your browser.');
     }, 8000);


      //create new map with inintail location
      city = {lat: 26.09951, lng: -80.38377};

       map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          styles: styles,
          center: city,
          mapTypeControl: false
        });
        var geocoder = new google.maps.Geocoder();

        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
          city = $('#address').value;
          search = $('#query').value;
        });

        google.maps.event.addDomListener(window, "resize" , function() {
          var center = map.getCenter();
          google.maps.event.trigger(map, "resize");
          map.setCenter(center);
        });


    }


    //use google geocoder to get lat and long for city

      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
             var lat = results[0].geometry.location.lat();
             var lng = results[0].geometry.location.lng();
             getEvents(city,search);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP
            });

          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }

        });

      }



      clearTimeout(self.mapRequestTimeout);

     infowindow = new google.maps.InfoWindow({maxWidth: 300});


      //var geocoder = new google.maps.Geocoder();
      //var lat = '';
      //var lng = '';
      //var address = document.getElementById('location').value;
      //geocoder.geocode( { 'address': address}, function(results, status) {
      //if (status == google.maps.GeocoderStatus.OK) {
        // lat = results[0].geometry.location.lat();
        // lng = results[0].geometry.location.lng();
        //}
       //else {
        //alert("Geocode was not successful for the following reason: " + status);
      //}
    //});
        //alert('Latitude: ' + lat + ' Logitude: ' + lng);*/





    this.activeEvents = ko.observable([]); //List of events
    this.activeStatus = ko.observable('Searching for events near you');
    this.mapMarkers = ko.observable([]); //All Map Marker
    this.filterlist = ko.observable([]); //Filtered list
    this.local = ko.observable(26.09951,-80.38377);
    this.numberOfEvents = ko.computed(function() {
   //return self.filterlist().length;
  });



// Use API to get search local data
    document.getElementById('submit').addEventListener('click', function() {
      city = $('#address').value;
      search = $('#query').value;
      alert(city);
    });
  function getEvents(city, search) {


// Use this function to format the date for the url
    Date.prototype.defaultView=function(){
      var dd=this.getDate();
      if(dd<10)dd='0'+dd;
      var mm=this.getMonth()+1;
      if(mm<10)mm='0'+mm;
      var yyyy=this.getFullYear();
      return String(yyyy+"-"+mm+"-"+dd)
    }
   //Get current date from user and format for url string
    var today = new Date();
    var dated =today.defaultView();


    var localURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20zip%3D'"+city+"'%20and%20query%3D'"+search+"'&format=json&diagnostics=true";
    alert(localURL);


    $.ajax({
      type: "GET",
      url: localURL,
      dataType: "jsonp",
      //jsonp: "callBack",
      success: function(data) {
        var eventList = data[1];

      }
    });










  initMap();
  getEvents("33327","parks");
}
  ko.applyBindings(new ViewModel());

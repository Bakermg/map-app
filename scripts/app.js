 function ViewModel() {
  var self = this;
  var map,city,infowindow;

  this.activeEvents = ko.observable([]); //List of events
  this.activeStatus = ko.observable('Searching for events near you');
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


     city = {lat: 26.09951,lng: -80.38377};
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
     initMap();
}

// Use API to get events data
  function getEvents(location) {
    var zips = location;

// Use this function to format the date for the url
    Date.prototype.defaultView=function(){
      var dd=this.getDate();
      if(dd<10)dd='0'+dd;
      var mm=this.getMonth()+1;
      if(mm<10)mm='0'+mm;
      var yyyy=this.getFullYear();
      return String(yyyy+"-"+mm+"-"+dd)
    }
  // Get current date from user and format for url string
    var today = new Date();
    var dated =today.defaultView();

    var activeURL = "http://api.amp.active.com/v2/search?query=Running&cb=displayResults&start_date="+dated+"..&zip="+zips+"&radius=50&api_key=uq2yyhkfewq9j2te9j754g6g";

    $.ajax({
      url: activeURL,
      jsonp: 'displayResults',
      dataType: 'jsonp',
      success: function() {
        alert('sucess');
        console.log(data);
      },
      error: function() {
        alert('Somethin went wrong please reload the page');
      }
    });
  }


  getEvents(33327);

  //initMap();
}
  ko.applyBindings(new ViewModel());

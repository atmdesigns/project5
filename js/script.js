
// Model
// My data consists of the location I'd like to visit plus two attractions

var theHotel = new google.maps.LatLng(32.940,-117.197);
var infowindow = new google.maps.InfoWindow();
var mapOptions = {
          center: theHotel,
          zoom: 10
    };
var map = new google.maps.Map(document.getElementById("map-container"),
            mapOptions);

var places = ko.observableArray ([
        {
            name: "San Diego Zoo",
            mylat: 32.736,
            mylong: -117.149,
            mycontent: '',
            //isVisible: ko.observable(false),
            id: "place1"
        },
        {
            name: "Legoland San Diego",
            mylat: 33.126,
            mylong: -117.309,
            mycontent: '',
            //isVisible: ko.observable(false),
            id: "place2"
        },
        {
            name: "San Diego Grand Del Mar Resort",
            mylat: 32.940,
            mylong: -117.197,
            mycontent: '',
            //isVisible: ko.observable(false),
            id: "place3"
        },
        {
            name: "La Jolla Playhouse",
            mylat: 32.871,
            mylong: -117.241,
            mycontent: '',
            //isVisible: ko.observable(false),
            id: "place4"
        },
        {
            name: "Museum of Contemporary Art San Diego",
            mylat: 32.717,
            mylong: -117.169,
            mycontent: '',
            //isVisible: ko.observable(false),
            id: "place5"
        }
        ]);

//ViewModel
var ViewModel = function() {
  var self=this;
   
  // Encapsulate markers to allow interaction with Google Maps
  var Pin = function (map, name, mylat, mylong, mycontent) {

    var marker;

  this.name = ko.observable(name);
  this.lat  = ko.observable(mylat);
  this.lon  = ko.observable(mylong);
  this.mycontent = ko.observable(mycontent);

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(mylat, mylong),
    animation: google.maps.Animation.DROP,

  });

  this.isVisible = ko.observable(false);
  
  this.isVisible.subscribe(function(isFiltered) {
    console.log(isFiltered);
     
    if (isFiltered) {
      
      marker.setMap(null);
    } 
    else {
      marker.setMap(map);
    }
     
    
  });

  this.isVisible(true);
  this.marker = marker;
}  //close addMarkers

  // Add markers
  google.maps.event.addListener(map, 'click', function() {
  infowindow.close();
  });

  
  for (i=0 ; i < places().length; i++) {
      //Create marker for each location
      places()[i].pin =  new Pin (map, places()[i].name, places()[i].mylat, places()[i].mylong, places()[i].mycontent);

      var content = places()[i].pin.mycontent();
      var heading = places()[i].pin.name();

      google.maps.event.addListener(places()[i].pin.marker ,'click', (function(pin,content,infowindow, heading){
       
        return function() {
            
            viewModel.getWikis(heading, infowindow);
                      
            infowindow.open(map,pin.marker); 
                  
      };
      })(places()[i].pin, content, infowindow, heading));
  }  //close marker creation loop

  // Filter and search
  self.locations = ko.observableArray(places());

  self.query = ko.observable('');

  self.search = ko.computed(function(){
   var filter = self.query().toLowerCase();

    return ko.utils.arrayFilter(self.locations(), function(location) {
       
       var isFiltered = location.name.toLowerCase().indexOf(filter) >= 0;

      if (location) {
          if (isFiltered) {
            location.pin.isVisible(true);

          }
          else {
          
            location.pin.isVisible(false);

          
          }
        }
       return isFiltered;
    });
  }); // close filter and search


  self.getWikis = function(heading, infowindow) {
    //get Wiki articles
      var thePlace = heading;
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + thePlace  +
                            '&format=json&callback=wikiCallback'; 
     
      var wikiRequestTimeout = setTimeout(function() {
                                        $wikiElem.text("failed to get wikipedia resources");
                                        },8000);
             
                $.ajax({
                    url: wikiUrl,
                    dataType: "jsonp",
                    //jsonp: "callback",
                    success: function ( response) {
                        var articleStr = response[0];           
                        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                         
                        content = url;
                        infowindow.setContent('<h4>' + heading + '</h4>' + '<a href="' + content + '">' + 'Wikipedia Link to ' +
                                heading + '</a>');
                       
                        clearTimeout(wikiRequestTimeout);
                      }
                }); //end ajax request
  };//end getWikis
};  //end ViewModel

function initialize() {
  
}


var viewModel = new ViewModel();
ko.applyBindings(new ViewModel());
google.maps.event.addDomListener(window, 'load', initialize);


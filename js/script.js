
// Model
// My data consists of the location I'd like to visit plus two attractions
var $wikiElem = $('#wikipedia-links');
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
            mycontent: 'This is one of the best zoos in the country!',
            show: ko.observable(true),
            id: "place1"
        },
        {
            name: "Legoland San Diego",
            mylat: 33.126,
            mylong: -117.309,
            mycontent: 'This is an excellent place to take the family!',
            show: ko.observable(true),
            id: "place2"
        },
        {
            name: "San Diego Grand Del Mar Resort",
            mylat: 32.940,
            mylong: -117.197,
            mycontent: 'Five stars.  Need I say more?',
            show: ko.observable(true),
            id: "place3"
        },
        {
            name: "La Jolla Playhouse",
            mylat: 32.871,
            mylong: -117.241,
            mycontent: 'No idea yet',
            show: ko.observable(true),
            id: "place4"
        },
        {
            name: "Museum of Contemporary Art San Diego",
            mylat: 32.717,
            mylong: -117.169,
            mycontent: 'Yay art!',
            show: ko.observable(true),
            id: "place5"
        }
        ]);
// clear out old data before new request
    $wikiElem.text("");

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

  this.show = ko.observable(false);

  this.show.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.show(true);
  this.marker = marker;
}  //close addMarkers

  // Add markers
  google.maps.event.addListener(map, 'click', function() {
  infowindow.close();
  });

  
  for (i=0 ; i < places().length; i++) {
      //Create marker for each location
      places()[i].pin =  new Pin (map, places()[i].name, places()[i].mylat, places()[i].mylong, places()[i].mycontent);

      var content = places()[i].pin.name();

      google.maps.event.addListener(places()[i].pin.marker ,'click', (function(pin,content,infowindow){
       
        return function() {
            infowindow.setContent(content);
            infowindow.open(map,pin.marker);
         
      //viewModel.getWikis(content);
      };
      })(places()[i].pin, content, infowindow));
  }  //close marker creation loop

  // Filter and search
  self.locations = ko.observableArray(places());

  self.query = ko.observable('');

  self.search = ko.computed(function(){
   var filter = self.query().toLowerCase();

    return ko.utils.arrayFilter(self.locations(), function(location) {
       
       var showPin = location.name.toLowerCase().indexOf(filter) >= 0;
       
       if (location) {      
          if (showPin) {
            location.show(true);
          }
          else {
          location.show(false);
          }
       }
        
       return showPin;
    });
  }); // close filter and search


  self.getWikis = function(content) {
    //get Wiki articles
      var theResort = "Del mar resort";
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + theResort  + 
                            '&format=json&callback=wikiCallback';
      console.log(wikiUrl);
      var wikiRequestTimeout = setTimeout(function() {
                                        $wikiElem.text("failed to get wikipedia resources");
                                        },8000);
                $.ajax({
                    url: wikiUrl,
                    dataType: "jsonp",
                    //jsonp: "callback",
                    success: function ( response) {
                        var articleList = response[0];

                        for (var i=0; i < articleList.length; i++) {
                            articleStr = articleList;
                            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                            $wikiElem.append('<li><a href="' + url + '">' +
                                articleStr + '</a></li>'); 
                            articleList = response[i];
                        }
                        clearTimeout(wikiRequestTimeout);
                      }
                  });
  };
};  //end ViewModel

function initialize() {
      
  
  
} 


var viewModel = new ViewModel();
ko.applyBindings(new ViewModel());
google.maps.event.addDomListener(window, 'load', initialize);



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

  self.points = ko.observableArray(places());

  self.query = ko.observable('');

  self.search = ko.computed(function(){
   
    var filter = self.query().toLowerCase();
       
    if (!filter) {
      // self.showOrHideMarkers(map);
      return self.points();
    } else {
        return ko.utils.arrayFilter(self.points(), function(point) {
       return point.name.toLowerCase().indexOf(filter) >= 0;
    })}
  });
  

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
      
  var currmarker = new google.maps.Marker({
      position: theHotel,
      map: map,
      title: "The Hotel"
      });  //close marker creation;

  currmarker.setMap(map);
  addMarkers(places);
} 

function addMarkers(locations){
google.maps.event.addListener(map, 'click', function() {
  infowindow.close();
});

var infowindow = new google.maps.InfoWindow();

//Create markers for each interesting place and add to map
  for (i=0 ; i < locations().length; i++) {
      //Create marker for each location
      locations()[i].marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations()[i].mylat, locations()[i].mylong),
        map: map,
        title: locations()[i].name,
        });  //close marker creation
      
      var content = locations()[i].name; 
      

      google.maps.event.addListener(locations()[i].marker ,'click', (function(marker,content,infowindow){
        return function() {
            infowindow.setContent(content);
            infowindow.open(map,marker);
            
            //add marker animation
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { marker.setAnimation(null); }, 750);
            

            //Get Wikipedia articles when marker is clicked
            viewModel.getWikis(content);
        };
      })(locations()[i].marker, content, infowindow));
  } //end for loop
}
var viewModel = new ViewModel();
ko.applyBindings(new ViewModel());
google.maps.event.addDomListener(window, 'load', initialize);


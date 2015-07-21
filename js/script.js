
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
            mycontent: 'Zoo Info Here',
            show: ko.observable(true),
            id: "place1"
            
            
        },
        {
            name: "Legoland",
            mylat: 33.126,
            mylong: -117.309,
            mycontent: 'Lego Info Here',
            show: ko.observable(true),
            id: "place2"
        },
        {
            name: "Grand Del Mar Resort",
            mylat: 32.940,
            mylong: -117.197,
            mycontent: 'Grand Info Here',
            show: ko.observable(true),
            id: "place3"
        }
        ]);


//View




//ViewModel
var ViewModel = function() {
  var self=this;

  self.searchPlaces = ko.observable();

  self.hidePlace = function() {
    var currentShow = this.show();
    this.show(!currentShow);

  }
    
}


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
//Create markers for each interesting place and add to map
  for (i=0 ; i < locations().length; i++) {
      //Create marker for each location
      locations()[i].marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations()[i].mylat, locations()[i].mylong),
        map: map,
        title: locations()[i].name,
        });  //close marker creation
      
      var content = locations()[i].name; 
      var infowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(locations()[i].marker ,'click', (function(marker,content,infowindow){
        return function() {
            infowindow.setContent(content);
            infowindow.open(map,marker);
        };
      })(locations()[i].marker, content, infowindow));
  } //end for loop
}

google.maps.event.addDomListener(window, 'load', initialize);
var viewModel = new ViewModel();
ko.applyBindings(new ViewModel())
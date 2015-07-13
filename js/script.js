
// Model
// My data consists of the location I'd like to visit plus two attractions

var infowindow = new google.maps.InfoWindow();


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
    var theHotel = new google.maps.LatLng(32.940,-117.197);       

    var mapOptions = {
          center: theHotel,
          zoom: 10
    };

    var currmarker = new google.maps.Marker({
        position: theHotel,
        map: mymap,
        title: "The Hotel"
        });  //close marker creation;

  var mymap = new google.maps.Map(document.getElementById("map-container"),
            mapOptions);

  currmarker.setMap(mymap);
  addMarkers(mymap, places);

 } 

function addMarkers(map, locations){
//Create markers for each interesting place and add to map
  
  
  for (i=0 ; i < locations().length; i++) {
     
      //Create marker for each location
      locations()[i].marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations()[i].mylat, locations()[i].mylong),
        map: map,
        title: locations()[i].name,
        });  //close marker creation
      
      currmarker = locations()[i].marker;
      var currcontent = locations()[i].mycontent;

      //Create info window for each location
      locations()[i].infowindow = new google.maps.InfoWindow({
        content: locations()[i].mycontent,
        });  //close info window creation
      //Create event listener for each location
      console.log(infowindow,currcontent);
      google.maps.event.addListener(currmarker, 'click', function() {
        
      infowindow.setContent(currcontent);
      infowindow.open(map,currmarker);
    
  });

  }
}

 // var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 

google.maps.event.addDomListener(window, 'load', initialize);
var viewModel = new ViewModel();
ko.applyBindings(new ViewModel())
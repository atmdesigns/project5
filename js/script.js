
// Model
// My data consists of the location I'd like to visit plus two attractions




var places = ko.observableArray ([
        {
            name: "San Diego Zoo",
            mylat: 32.736,
            mylong: -117.149,
            
            
        },
        {
            name: "Legoland",
            mylat: 33.126,
            mylong: -117.309,
            
        },
        {
            name: "Grand Del Mar Resort",
            mylat: 32.940,
            mylong: -117.197,
            
        }
        ]);

//View
var mapOptions = {
          center: { lat: 32.940, lng: -117.197},
          zoom: 10
    };



//ViewModel
var ViewModel = function() {
    
  
    
}


 function initialize() {
            

    addMarkers(places);

 } 

function addMarkers(locations){
//Create markers for each interesting place and add to map

  for (i=0 ; i < locations().length; i++) {
     

      locations()[i].marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations()[i].mylat, locations()[i].mylong),
        map: map,
        title: locations()[i].name
      });  
  }
}




  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

 

google.maps.event.addDomListener(window, 'load', initialize);
ko.applyBindings(new ViewModel())
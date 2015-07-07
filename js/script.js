
// Model
// My data consists of the location I'd like to visit plus two attractions
var theHotel = new google.maps.LatLng(32.940,-117.197);



var Place = function () {
    this.funPlaces = ko.observableArray ([
        //{
             "San Diego Zoo",
         //   coords: new google.maps.LatLng (32.736, -117.149)
        //},
        //{
            "Legoland",
          //  coords: new google.maps.LatLng(33.126, -117.309)
        //}
        ]);
}

//View
var mapOptions = {
          center: { lat: 32.940, lng: -117.197},
          zoom: 10
    };




//ViewModel
var ViewModel = function() {
    
    this.currentPlace = ko.observable (new Place() );

    

       


    }

;
 function initialize() {
            var myLatlng = new google.maps.LatLng(32.940, -117.197);

            } 


    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

 var marker = new google.maps.Marker({
      position: new google.maps.LatLng(32.940,-117.197),
      map: map,
      title: 'San Diego Grand Del Mar Resort!'
  });  
 var marker1 = new google.maps.Marker({
      position: new google.maps.LatLng(32.736,-117.149),
      map: map,
      title: 'San Diego Zoo!'
  });  
 var marker2 = new google.maps.Marker({
      position: new google.maps.LatLng(33.126,-117.309),
      map: map,
      title: 'Legoland!'
  });  


google.maps.event.addDomListener(window, 'load', initialize);
ko.applyBindings(new ViewModel())
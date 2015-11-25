var pos;
var map = initMap();

function note(data) {

    var self = this;

    self.note = ko.observable(data.note);
    self.pos = {
      "lat": data.pos.lat,
      "lng": data.pos.lng
    };
    self.time = data.time;
    self.fake = data.fake;
    //self.meal = ko.observable(initialMeal);
}

function ViewModel() {
  var self = this;    
  self.folders = ['Post', 'View'];
  self.chosenFolderId = ko.observable('View');

  // Behaviours
  self.goToFolder = function(folder) { self.chosenFolderId(folder); };

  self.noteList = ko.observableArray([]);

  //noteData.forEach(function(noteItem){
    //self.noteList.push( new note(noteItem));
  //  createCir(map,noteItem.pos);
  //});
  $.getJSON("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a", function(allData) {
      var ajaxNotes = $.map(allData, function(item){ 
        item.pos.lat = Number(item.pos.lat);
        item.pos.lng = Number(item.pos.lng);
        createMrk(item.pos, item.note);
        return new note(item); 
      });
      self.noteList(ajaxNotes);
  }); 
}


$(function (){
  ko.applyBindings(new ViewModel());

  $.get("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a")
    .done(function(data) {
      console.log("Products retrieved.");
      data.forEach(function(note){
        console.log(note.note);
      })
      //console.log(data[0].note); // Laptop
    });  
/*
  $.ajax({
    url: 'https://openws.herokuapp.com/map_notes/5654ddc267ae1d03004ff097?apiKey=1e63b6cd56a33614f063ed928e35f17a',
    type: 'DELETE',
    success: function(result) {
        // Do something with the result
       console.log("Product deleted successfully");
       console.log(result);
    }
  });  
*/  
  /*
  allnotes.forEach(function(item){
    console.log(item);
    $.post("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a", item)
      .done(function(data){
        console.log("json obj saved successfully :" + data.note);
      });
  }); */

/*
  $.post("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a", noteData)
    .done(function(data){
      console.log("json obj saved successfully");
      console.log(noteData);   // 547ba6d00b07515f0d4b6c62
      console.log(data[0].note);  // Laptop
      console.log(data[0].price); // 2000
      console.log(data[1]._id);   // 547ba6d00b07515f0d4b6c62
      console.log(data[2].name);  // Laptop
      console.log(data[3].price); // 2000         
    });
*/

});

function createCir(map, pos){

	var cityCircle = new google.maps.Circle({
      strokeColor: '#333E48',
      strokeOpacity: 0.0,
      strokeWeight: 0,
      fillColor: '#D71472',
      fillOpacity: 0.25,
      map: map,
      center: pos,
      radius: 1000
    });
}

function createMrk(pos, note) {
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: note
  });
}

function initMap(){

  var map = new google.maps.Map(document.getElementById('map'), {
                      center: {lat: 87.389, lng: -72.094},
                      scrollwheel: false,
                      mapTypeControl: false,
                      zoom: 12
                      });

  // Try HTML5 geolocation.
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
      //map.setCenter(pos);

    map.setCenter(pos);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos){
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  }

  return map;
}

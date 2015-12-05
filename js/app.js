var pos;
var canPost = false;
var map = initMap();
var markerArr = [];
var markers = [];
var infowindow = [];

function note(data) {

    var self = this;

    self.note = ko.observable(data.note);
    self.pos = {
      "lat": data.pos.lat,
      "lng": data.pos.lng
    };
    self.time = data.time;
    self.fake = data.fake;
    self.id = data._id;
    //self.meal = ko.observable(initialMeal);
}

function ViewModel() {
  var self = this;    
  self.folders = ['Post', 'View', 'Delete'];
  self.chosenFolderId = ko.observable('View');

  // Behaviours
  self.goToFolder = function(folder) { self.chosenFolderId(folder); };
  self.clickNoteItem = function(noteList){ console.log(noteList.id); };

  self.noteList = ko.observableArray([]);

  //noteData.forEach(function(noteItem){
  $.getJSON("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a", function(allData) {
      var ajaxNotes = $.map(allData, function(item){ 
        item.pos.lat = Number(item.pos.lat);
        item.pos.lng = Number(item.pos.lng);
        markerArr.push(item);
        return new note(item); 
      });
      self.noteList(ajaxNotes);
  }).done(function(){drop();})
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

  // Save a new map note to server
  self.save = function() {
    if(canPost==true){
      var date = Date.now();
      $.ajax("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a", {
          data: ko.toJSON({ note: $('#note').val(), time: date, pos: pos }),
          type: "post", contentType: "application/json",
          success: function(result) { console.log(ko.toJSON({ name: $('#note').val(), location: pos })); }
      }); 
    self.getNotes();
    } else {
      console.log("location unknown, can't post");
    }
  };

  self.deleteNote = function(){

    $.ajax({
      url: 'https://openws.herokuapp.com/map_notes/' + $('#noteID').val() + '?apiKey=1e63b6cd56a33614f063ed928e35f17a',
      type: 'DELETE',
      success: function(result) {
          // Do something with the result
         console.log("Product deleted successfully");
         console.log(result);
      }
    });  

  }

  self.getNotes = function(){

    self.noteList() = ko.observableArray([]);
    markerArr = [];
    markers = [];
    infowindow = [];

    $.getJSON("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a", function(allData) {
        var ajaxNotes = $.map(allData, function(item){ 
          item.pos.lat = Number(item.pos.lat);
          item.pos.lng = Number(item.pos.lng);
          markerArr.push(item);
          return new note(item); 
        });
        self.noteList(ajaxNotes);
    }).done(function(){drop();})
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
    });   

  }

}

function drop() {

  clearMarkers();
  for (var i = 0; i < markerArr.length; i++) {
    console.log(markerArr[i].pos);
    addMarkerWithTimeout(markerArr[i].note, markerArr[i].pos, i * 400);
  } 
}

function addMarkerWithTimeout(note, position, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));

    infowindow.push(new google.maps.InfoWindow({
      content: "<h3>"+note+"</h3>"
    }));

    markers[markers.length-1].addListener('click', (function(marCopy, infowCopy){
      return function(){
        infowCopy.open(map, marCopy);
      };
    })(markers[markers.length-1], infowindow[infowindow.length-1]));
  }, timeout);
}

function clearMarkers() { 
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

$(function (){
  ko.applyBindings(new ViewModel());
/*
  $.get("https://openws.herokuapp.com/map_notes?apiKey=1e63b6cd56a33614f063ed928e35f17a")
    .done(function(data) {
      console.log("Products retrieved.");
      data.forEach(function(note){
        console.log(note.note);
      })
      //console.log(data[0].note); // Laptop
    });  
*/
/*
  $.ajax({
    url: 'https://openws.herokuapp.com/map_notes/565a46572926f603007857b8?apiKey=1e63b6cd56a33614f063ed928e35f17a',
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
    title: note,
    draggable: true,
    animation: google.maps.Animation.DROP
  });
  //console.log(markerArr[markerArr.length-1]);
  marker.addListener('click', (function(markerCopy){

    return function(){
      toggleBounce(markerCopy);
    }

  })(marker));  
  //markerArr[markerArr.length-1].setAnimation(google.maps.Animation.BOUNCE);
  //markerArr.push(marker);

}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(stopAnimation(marker), 1500);
  }
}

function stopAnimation(marker){
  marker.setAnimation(null);
  return false;
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
      canPost = true;

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

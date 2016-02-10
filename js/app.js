
var map;
var pos = {};

function ViewModel() {

  var self = this;
  self.notes = ko.observableArray([]);
  self.noteToPush = ko.observable("");
  self.currentNote = ko.observable("");

  self.currentNote = ko.observable();

  self.tabs = ['Search', 'Post'];
  self.chosenTabId = ko.observable('Search');

  // created one infowindow variable, only one stays opens
  var infowindow = new google.maps.InfoWindow(); 

  self.ShowWhichTab = function(tabName) {

    //console.log("hello2: " + self.chosenTabId());

    if(tabName == self.chosenTabId()) {
      return ko.observable(true);
    } else {
      return ko.observable(false);
    }

  }

  self.goToTab = function(tab) { 
    self.chosenTabId(tab);
    console.log(tab); 
  }; 

  self.clickedNote = function(note) {
    console.log(note);
  };   

  var db = new Firebase('https://map-notes.firebaseio.com/');

  self.pushNote = function(){
    var d = new Date();
    var seconds = d.getTime();
    db.push({"note": this.noteToPush(),
              "pos": pos,
              "time": seconds});
    this.noteToPush("");
  }


  db.on("child_added", function(addedSnap){

    var item = {
      "note": addedSnap.val().note,
      "pos": addedSnap.val().pos,
      "key": addedSnap.key()
    };

    //self.notes.push(item);
    self.notes.push(
        new google.maps.Marker({
        position: addedSnap.val().pos,
        map: map,
        title: addedSnap.val().note,
        selected: ko.observable(false),
        animation: google.maps.Animation.DROP
        })
      );

    // pop the last gmap marker from the array to add
    // listener

    var marker = self.notes.pop();

    marker.addListener('click', function(){
      /* var infowindow = new google.maps.InfoWindow({
                              content: "<h1>"+marker.title+"</h1>",
                              maxWidth: 200
                            });  
      */
      infowindow.setContent( "<h1>"+marker.title+"</h1>" );
      self.resetSelect();
      marker.selected(true);     
      infowindow.open(map, marker);
    });

    self.notes.push(marker);


    addedSnap.ref().on("value", function(valueSnap) {

      if (valueSnap.val()) {
          item.content = valueSnap.val().content;
      } else {
          self.notes.remove(item);
      }

    });

  });

  self.resetSelect = function(){

    for(var x=0; x < self.notes().length; x++ ){
      self.notes()[x].selected(false);
      console.log(x);
    }

  }

  self.infoWinClick = function(index, clickedNote){

    self.currentNote(self.notes()[index()]);

    // go through the notes array and makes selected variable false
    self.resetSelect();

    // turns the selected obverable array to true
    clickedNote.selected(true);

    //infowindow.open(map, marker);
    infowindow.setContent( "<h1>"+clickedNote.title+"</h1>" );     

    infowindow.open(map, clickedNote);
    //self.currentNote = ko.observable( self.notes()[clickedNote] );
  }

};




$(function (){

    ko.applyBindings( new ViewModel() );
    map = initMap();

});

function initMap(){

  var map = new google.maps.Map(document.getElementById('map'), {
                      center: {lat: 87.389, lng: -72.094},
                      scrollwheel: false,
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
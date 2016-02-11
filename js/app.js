//global variables
var map;
var pos = {};

function ViewModel() {

  var self = this;
  //Main array with the data from the firebase database
  self.notes = ko.observableArray([]);

  //Variable with the new note to be push to the firebase database
  self.noteToPush = ko.observable("");

  //Variable that holds the current note that is clicked on
  self.currentNote = ko.observable("");

  //the names of the tabs in the view
  self.tabs = ['Search', 'Post'];

  //the tab the app defaults too
  self.chosenTabId = ko.observable('Search');

  //created one infowindow variable, only one stays opens
  var infowindow = new google.maps.InfoWindow(); 

  //function used by the view to determine which tab to show
  self.ShowWhichTab = function(tabName) {

    if(tabName == self.chosenTabId()) {
      return ko.observable(true);
    } else {
      return ko.observable(false);
    }

  }

  // function used by the view to select which tab the user wants
  self.goToTab = function(tab) { 
    self.chosenTabId(tab);
  }; 

  // function used to debug
  self.clickedNote = function(note) {
    console.log(note);
  };   

  //Firebase database reference
  var db = new Firebase('https://map-notes.firebaseio.com/');

  //function used by view to push note to firebase db
  self.pushNote = function(){

    //get data info for the pushed note
    var d = new Date();
    var seconds = d.getTime();

    //note object use to fb db
    db.push({"note": this.noteToPush(),
              "pos": pos,
              "time": seconds});

    //clears the variable blind to the input textbox in the view
    this.noteToPush("");
  }

  // Reading data from fb, "child_added" is triggered once for each initial child, and
  // again every time a new child is added
  db.on("child_added", function(addedSnap){

    //not in use, was for early debuging
    var item = {
      "note": addedSnap.val().note,
      "pos": addedSnap.val().pos,
      "key": addedSnap.key()
    };

    //pushes each child into notes observable array as a gmaps marker
    //title contains the note, and selectec is an observable variable that changes
    //based on a clicked note from the list in the view.
    self.notes.push(
        new google.maps.Marker({
        position: addedSnap.val().pos,
        map: map,
        title: addedSnap.val().note,
        selected: ko.observable(false),
        animation: google.maps.Animation.DROP
        })
      );

    //pops the last gmap marker from the array to add an event listener
    //and infowindow content
    var marker = self.notes.pop();

    marker.addListener('click', function(){

      infowindow.setContent( "<h1>"+marker.title+"</h1>" );
      //reset selected variable from the notes array
      self.resetSelect();
      //when clicked it's selected
      marker.selected(true);
      //how the window opens     
      infowindow.open(map, marker);

    });

    //gmap marker pushed backed into notes observable array.
    self.notes.push(marker);


    addedSnap.ref().on("value", function(valueSnap) {

      if (valueSnap.val()) {
          item.content = valueSnap.val().content;
      } else {
          self.notes.remove(item);
      }

    });

  }); //end of db.on("child_added", function(addedSnap){}

  //runs though the notes array to clear out the selected variable
  self.resetSelect = function(){

    for(var x=0; x < self.notes().length; x++ ){
      self.notes()[x].selected(false);
      console.log(x);
    }

  }

  //function that runs when user clicked on the list of notes from the view.
  self.infoWinClick = function(index, clickedNote){

    //sets the currentNote to the one being selected, this isnt being used much.
    self.currentNote(self.notes()[index()]);

    //go through the notes array and makes selected variable false
    self.resetSelect();

    //turns the selected obverable variable to true on the note being clicked
    clickedNote.selected(true);

    //sets the content for the infowindow, the note.
    infowindow.setContent( "<h1>"+clickedNote.title+"</h1>" );   

    //opens infowindow
    infowindow.open(map, clickedNote);
  }

};



//applys KO binding on document load, and initialize the google map
$(function (){

    ko.applyBindings( new ViewModel() );
    map = initMap();

});

//Function that initializing the google map
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
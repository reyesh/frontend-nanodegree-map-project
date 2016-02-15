//global variable
var pos = {};

function ViewModel() {

  var self = this;
  //Main array with the data from the firebase database
  self.notes = ko.observableArray([]);

  //Observable variable used for the badge next to the title on the view  
  self.numOfNotes = ko.observable(0);

  //Search Array 
  self.searchNotes = ko.observableArray([]);

  //Search query
  self.query = ko.observable('');

  //Variable with the new note to be push to the firebase database
  self.noteToPush = ko.observable("");

  //Variable that holds the current note that is clicked on
  self.currentNote = ko.observable("");

  //the names of the tabs in the view
  self.tabs = ['Search', 'Post', 'About'];

  //the tab the app defaults too
  self.chosenTabId = ko.observable('Search');

  //created one infoWindow variable, only one stays opens
  var infoWindow = new google.maps.InfoWindow(); 

  //Firebase database reference
  var db = new Firebase('https://map-notes.firebaseio.com/');

  //function used by the view to determine which tab to show
  self.ShowWhichTab = function(tabName) {

    if(tabName == self.chosenTabId()) {
      return ko.observable(true);
    } else {
      return ko.observable(false);
    }

  };

  // function used by the view to select which tab the user wants
  self.goToTab = function(tab) { 
    self.chosenTabId(tab);
  }; 

  // function used to debug
  self.clickedNote = function(note) {
    console.log(note);
  };

  self.deletePost = function(note) {
    console.log("delete: " + note.title);
    console.log("delete: " + note.fbkey);
    db.child(note.fbkey).remove();
  };  

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
  };

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
        animation: google.maps.Animation.DROP,
        fbkey: addedSnap.key()
        })
      );

    //pops the last gmap marker from the array to add an event listener
    //and infoWindow content
    var marker = self.notes.pop();

    marker.addListener('click', function(){

      infoWindow.setContent( "<h1>"+marker.title+"</h1>" );
      //reset selected variable from the notes array
      self.resetSelect();
      //when clicked it's selected
      marker.selected(true);
      //how the window opens     
      infoWindow.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ 
        marker.setAnimation(null);
      }, 750);
/*
      if(marker.getAnimation() !== null){
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
*/

    });

    //gmap marker pushed backed into notes observable array.
    self.notes.push(marker);    

    //the check if data ever changes
    addedSnap.ref().on("value", function(valueSnap) {

      //updates the marker if it isn't null
      if (valueSnap.val()) {
          //marker.position = valueSnap.val().pos;
          console.log(valueSnap.val().pos);
          marker.title = valueSnap.val().note;
          marker.selected(false);
          //marker.fbkey = valueSnap.key();

      } else { // else the marker will be turned off, and removed from the array.
          marker.setMap(null);
          self.notes.remove(marker);
      }

    }); //addedSnap.ref().on("value", function(valueSnap){}

      //used for the badge on the view, next to the title
      self.numOfNotes(self.notes().length);

      //copy of notes array used in the search function
      self.searchNotes(self.notes().slice(0));
  }); //end of db.on("child_added", function(addedSnap){}

  //runs though the notes array to clear out the selected variable
  self.resetSelect = function(){

    for(var x=0; x < self.notes().length; x++ ){
      self.notes()[x].selected(false);
    }

  };

  //function that runs when user clicked on the list of notes from the view.
  self.infoWinClick = function(index, clickedNote){
    console.log("infowin: " + clickedNote.title);
    //sets the currentNote to the one being selected, this isnt being used much.
    self.currentNote(self.notes()[index()]);

    //go through the notes array and makes selected variable false
    self.resetSelect();

    //turns the selected obverable variable to true on the note being clicked
    clickedNote.selected(true);

    //sets the content for the infoWindow, the note.
    infoWindow.setContent( "<h1>"+clickedNote.title+"</h1>" );   

    //opens infoWindow
    infoWindow.open(map, clickedNote);

    clickedNote.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ 
        clickedNote.setAnimation(null);
    }, 750);

  };

  //Used by the search function to remove and unselect markers during search
  self.deleteObArray = function(ObArray){
    console.log(ObArray().length);
    for(var x=0; x < ObArray().length; x++ ){
      ObArray()[x].setMap(null);
      ObArray()[x].selected(false);
    }
    return ObArray;
  };


  self.search = function(value) {

    //remove all notes from the view
    self.notes = self.deleteObArray(self.notes);
    self.notes.removeAll();
    var marker;
    //iterate through the copyed observable array 
    ko.utils.arrayForEach(self.searchNotes(), function(note){
      //With each note in searchNotes, we check if the query is present
      if(note.title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        //if so we push it to the notes obserable array, which gets seen in the view
        self.notes.push(note);
        marker = self.notes.pop();
        marker.setMap(map);
        self.notes.push(marker);
      } 

    });

  };
  //subscribes to update on query with a call to the search function 
  self.query.subscribe(self.search);

} // end of ViewModel



//applys KO binding on document load, and initialize the google map
$(function (){


});

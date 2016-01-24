
var map;
var pos = {};

function ViewModel() {

  var self = this;
  self.notes = ko.observableArray([]);
  self.noteToPush = ko.observable("");

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
      "key": addedSnap.name()
    };

    //self.notes.push(item);
    self.notes.push(
        new google.maps.Marker({
        position: addedSnap.val().pos,
        map: map,
        note: addedSnap.val().note
        })
      );

    addedSnap.ref().on("value", function(valueSnap) {

      if (valueSnap.val()) {
          item.content = valueSnap.val().content;
      } else {
          self.notes.remove(item);
      }

    });

  });

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

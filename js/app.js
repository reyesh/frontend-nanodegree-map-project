var ViewModel = {

	notes: ko.observableArray([]),
	loaded: ko.observable(false),
	form: {
		note: ko.observable(''),
		pos: ko.observableArray([]),
		time: ko.observable('')
	}
}

var db = new Firebase('https://map-notes.firebaseio.com/');
var map;
var pos;

$(function (){

    ko.applyBindings(ViewModel);
    db.on('child_added', GetNotes);
    //db.on('child_removed', TrackRemoved);
    map = initMap();
    mapNotes();

});

function GetNotes(data) {

    var val = data.val();
    console.log(val);

    ViewModel.notes.push({
        note: val.note,
        time: val.time,
        pos: {
        	"lat": val.pos.lat,
        	"lng": val.pos.lng
        }
    });

    ViewModel.loaded(true);

    // Maps the notes on the map
    var noteItem = ViewModel.notes.pop();
    //console.log("in GetNotes: " + noteItem.note);
    createCir(map, noteItem.pos);
    ViewModel.notes.push(noteItem);

}

function createCir(map, pos){

	var cityCircle = new google.maps.Circle({
      strokeColor: '#333E48',
      strokeOpacity: 0.0,
      strokeWeight: 0,
      fillColor: '#D71472',
      fillOpacity: 0.25,
      map: map,
      center: pos,
      radius: 10
    });
}

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

function loadData (){

  var note = $("#note").val();
  var date = Date.now();
  db.push({ note: note, time: date, pos: { lat: pos.lat, lng: pos.lng } });
  //console.log(pos);
  return false;

};

$('#noteform').submit(loadData);

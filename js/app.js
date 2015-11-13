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

$(function () {
    ko.applyBindings(ViewModel);
    db.on('child_added', GetNotes);
    //db.on('child_removed', TrackRemoved);
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

    for (var i=0; i<ViewModel.notes().length; i++){
    	createCir(map, ViewModel.notes()[i].pos);
    }
}

var map = new google.maps.Map(document.getElementById('map'), {
										center: {lat: 87.389, lng: -72.094},
										scrollwheel: false,
										zoom: 12
										});

// Try HTML5 geolocation.
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(function(position) {
  var pos = {
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


function createCir(map, pos){

	var cityCircle = new google.maps.Circle({
      strokeColor: '#333E48',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#D71472',
      fillOpacity: 0.25,
      map: map,
      center: pos,
      radius: 400
    });
}

function initMap() {
  // Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
										center: {lat: 87.389, lng: -72.094},
										scrollwheel: false,
										zoom: 12
										});
	  //var infoWindow = new google.maps.InfoWindow({map: map});



  return map;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}


//.maps.event.addDomListener(window, 'load', initMap() );

function loadData(){

	console.log($('#city').val());
	initMap();

/*	$.getJSON("https://www.udacity.com/public-api/v0/courses", function(data) {
	    $.each(data.courses, function(count) {
	    	$('#courselist').append('<li>'+ data.courses[count].title +'</li>');
	        //console.log(data.courses[count].title);
	        //console.log(data.courses[count].homepage);
	    });
	});
*/
	return false;
}

function displayData(){
	console.log(rectangle.bounds);
	return false;
}


$('#form-container').submit(loadData);
$('#console-btn').click(displayData);

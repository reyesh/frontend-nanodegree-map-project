#Udacity's Front End Web Development Nanodegree
##Project 5-1 - Neighborhood Map Project

A single page application featuring a map of your local neighborhood, and anonymous notes posted by your neighbors.

Technologies used to built this project, Knockout JS, jQuery, Google Maps API and Firebase API.

[Current Live Version](http://reye.sh/frontend-nanodegree-map-project/)

##About
This project introduce me to the idea of using a JavaScript framework to develop single page web applications. The important is understanding the implementation of the Model-View-ViewModel pattern design KnockoOutJS provides.

The requirements for the project was to use KnockOutJS along with two APIs. In my web app I used the Google Maps API and Firebase API. My project allows anyone to post a note anonymously on the displayed map which shows the user's location.

Other features include being able to click on a note and having it highlighted on the map and vice versa, being able to see newly posted notes without refreshing the app, live searching list of notes and markers on the map update dynamically depending on search query, and the site is responsive the app is very friendly on mobile.

##Files

Everything under the src directory contains the source development files, app.js being the heart of the web app, and /index.html is the final production code

src/js/app.js

src/css/style.css

src/index.html

index.html

##Grunt 
The following are needed to make final production code

jshint
uglify
cssmin
processhtml

All development files are located inside /src directory, the final production file is located on root at /index.html. A single page app which allows it to run on github servers at reyesh.github.io/frontend-nanodegree-map-project/ or http://reye.sh/frontend-nanodegree-map-project/

To make a final development version download the plug ins above. jshint checks for js errors, uglify minifys the javascript, cssmin miniflys the css and processhtml inserts the minified js and css into the /index.html (at root).

##Resources Used

Google Map API doc
https://developers.google.com/maps/documentation/javascript/tutorial

Firebase API doc
https://www.firebase.com/docs/web/

Knockout JS doc
http://knockoutjs.com/documentation/introduction.html

Knockout JS & Firebase CRUD example
http://jsfiddle.net/hiroshi/NBPcN/

Live search with knockout.js
http://opensoul.org/2011/06/23/live-search-with-knockoutjs/


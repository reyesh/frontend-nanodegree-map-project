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

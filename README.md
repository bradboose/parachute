#Parachute

Parachute is a javascript plugin which allows for gracefully degraded jQuery tranformations in non webkit browsers, notabably IE7 and IE8.  It is meant to be used alongside of transit.js and employs the same syntax.  Both transit and parachute use jQuery's syntax for animation, replacing '$(elem).animate{...}' with '$(elem).transition{...}'

By including both transit and parachute in your application, your animations/transforms will upgrade to CSS3 in webkit browsers (transit) and emulate transitions as best as psossible using for non webkit browser (parachute).

##This project contains the following:

- dist/jquery.parachute.js
- A test app demonstrating the animations supported by parachute

##Requirements for parachute

- JQuery
- transform.js - rotate/skew calculations
- add-easing.js
- transit.js (optional, but recommended for cross-browser animations solution)

##Instructions

- Add dist/jquery.parachute.min.js to your page
- Add add-easing.js from /source/javascripts/lib
- Add the js libraries transform.js and add-easing.js (see below to download latest versions)
- Add transit for full browser capability coverage if desired

##Notes

Currently does not yet support rotateX/rotateY/rotate3d, chaining of animations and transformOrigin.  All will be part of future enhancements.

Much credit due to Rico Sta Cruz (@rstacruz) as the test application page was borrowed from transit.js.

###The following files exist for demo purposes only:

- The entire source folder

###Downloads for latest versions

- jQuery - http://jquery.com//
- transit.js -  https://github.com/rstacruz/jquery.transit
- transform.js - https://github.com/louisremi/jquery.transform.js


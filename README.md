#Parachute

Parachute is a jQuery plugin allowing for the usage of CSS3 style transformations ('rotate', 'skew', 'scale', etc) in non webkit browsers, notably IE7 and IE8, where the transforms are not supported.  It is meant to be used alongside of transit.js to allow for one common animation syntax to optimize jQuery style animations in all devices and browsers.

Parachute emulates the syntax for animations used by transit.js, which replaces jQuery's $(elem).animate{...}' with '$(elem).transition{...}'

By including both transit and parachute in your application, your animations/transforms will upgrade to CSS3 in webkit browsers (transit) and emulate transitions as best as possible for non webkit browsers (parachute).

Example:

Instead of....

  $('.box').animate({ skewX: '30deg', x: '100px' })

use...

  $('.box').transition({ skewX: '30deg', x: '100px' })


##This project contains the following:

- dist/jquery.parachute.js
- A test app demonstrating Parachute located under the source directory

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


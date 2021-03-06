/*
 * map.js
 * 
 * This code runs upon showing the #map page. On the State page (#second), there is a button that links
 * to the #map page. Upon clicking that, the #map page populates an <h3> with the current state's name
 * in it, and populates a div with id #map-canvas with a Google Map. The Google Map pops up an InfoWindow
 * containing the current state's artwork, and points at that state's latitude/longitude.
 * 
 * Upon leaving the #map page, the state name text should be removed from the h3, and the google map
 * stuff should be removed from the #map-canvas div. Using JQuery empty() method to do that.
 */

// Run this code on show of the #map page
$(document).delegate("#map", "pageshow", function() {
	var map, // The Google Map
	zoomLevel, // The zoom level (larger sreens should be zoomed in more)
	screenWidth, // The width of the screen
	screenHeight, // The height of the map
	stateName = $('#statename'); // The current state's name
	
	// Add the stateName inside the <h3></h3> tag on the #map page
	$('#map > div[data-role="content"] > h3').text(stateName.text());
	
	// Get the latitude and longitude of the state we want to point out
	$.ajax({
        type: 'GET',
        url: servicesURL + 'state_list/' + state,
		dataType: 'json',
		success: addMap
	});
	
	// Add the google map inside the #map-canvas div
	function addMap(data) {
		var artworkImgSrc = "images/" + data.state[0].abv + "-small.png",
			lat = data.state[0].latitude, // Current state's latitude
			lon = data.state[0].longitude, // Current state's longitude
			stateLatLon = new google.maps.LatLng(lat, lon); // create new LatLng object with the state's lat/lon
		
		// Determine the window size to set zoom
		screenWidth = $(window).width();
		if (screenWidth > 666) {
			zoomLevel = 4;
		} else {
			zoomLevel = 3;
		}
		
		// Set the options for the Google Map
		var mapOptions = {
			zoom: zoomLevel, // Zoom Level
			center: stateLatLon, // Center the map on the state
			disableDefaultUI: true, // Don't show pegman and map controls
			click: false, // Don't allow clicking on map
			mapTypeId: google.maps.MapTypeId.ROADMAP // ROADMAP map type
		};
		
		// The styles array for the map (only show the outlines of the states, no labels)
		// Generated using Google's Styled Map Wizard:
		// http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
		var stylesArray = [
		  {
		    "featureType": "administrative.province",
		    "elementType": "geometry",
		    "stylers": [
		      { "weight": 1.3 },
		      { "color": "#686766" }
		    ]
		  },{
		  },{
		    "featureType": "administrative.country",
		    "elementType": "geometry",
		    "stylers": [
		      { "color": "#161316" },
		      { "weight": 0.9 }
		    ]
		  },{
		    "featureType": "administrative.country",
		    "elementType": "labels.text",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },{
		    "featureType": "water",
		    "elementType": "labels.text",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },{
		    "featureType": "administrative.locality",
		    "elementType": "labels",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },{
		    "featureType": "administrative.province",
		    "elementType": "labels.text",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  }
		];
		
		// Create the new Google Map with the above mapOptions
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		// Set the options set in the stylesArray
		map.setOptions({styles: stylesArray});
		
		// Determine the screen size
		screenWidth = $(window).width();
		screenHeight = $(window).height();
		// If screen size is larger than 666px, set zoom to 4, otherwise set to 3
		if (screenWidth > 666) {
			map.setZoom(4);
		} else {
			map.setZoom(3);
		}
		// Set the height of #map-canvas
		$('#map-canvas').height(screenHeight - $('#map h3').outerHeight() - 45);
		
		
		// Display an InfoWindow containing the state artwork that points to the state
		var infoWindow = new google.maps.InfoWindow({
	    	content: '<img class="artwork" src="' + artworkImgSrc + '">',
	    	map: map,
	    	position: stateLatLon
	  	});
		
		// Resize map when switching between portrait/landscape mode
		// If window size is larger than 666px, set zoom to 4, otherwise set zoom to 3
		$(window).on("orientationchange", function(evt) {
			screenWidth = $(window).width();
			screenHeight = $(window).height();
			if (screenWidth > 666) {
				map.setZoom(4);
			} else {
				map.setZoom(3);
			}
			// Set the height of #map-canvas
			$('#map-canvas').height(screenHeight - $('#map h3').outerHeight() - 45);
			map.setCenter(stateLatLon);
		});
		
		// Keep state within a certain rectangle, so user can't just pan around the whole world
		// Use LatLngBounds(Southwest Latlng, Northeast LatLng) to define the rectangle,
		// then check if state is within the rectangle on the 'move' event
		// Found solution here: http://stackoverflow.com/questions/4631382/google-maps-limit-panning
		var center;
		boundingRect = new google.maps.LatLngBounds( // The bounding rect
			new google.maps.LatLng(5.615986, -176.484375), // Southwest corner of bounding rect
			new google.maps.LatLng(73.824820, -44.296875)  // Northeast corner or bounding rect
		);
		google.maps.event.addListener(map, 'dragend', function() {
			if (boundingRect.contains(map.getCenter())) {
				return; // Center is inside bounding Rect, do nothin'
			}
			
			// We're out of bounds - Move the map back within the bounds
			//alert("outside bounding box");
			var center = map.getCenter(),
			    x = center.lng(),
				y = center.lat(),
				maxX = boundingRect.getNorthEast().lng(),
				maxY = boundingRect.getNorthEast().lat(),
				minX = boundingRect.getSouthWest().lng(),
				minY = boundingRect.getSouthWest().lat();
		
		    if (x < minX) x = minX;
		    if (x > maxX) x = maxX;
		    if (y < minY) y = minY;
		    if (y > maxY) y = maxY;
		
		    window.setTimeout(function() {
	      		map.panTo(stateLatLon);  // Pan the map back to our state after 300 milliseconds
	    	}, 300);
		}); // end dragend listener
	} // end addMap()
	
}); // end #map pageshow function


// This code runs upon leaving the #map page
$(document).delegate("#map", "pagehide", function() {
	// Empty the state name text inside the <h3></h3> on the #map page
	$('#map > div[data-role="content"] > h3').empty();
	// Empty the contents of the #map-canvas div
	$('#map #map-canvas').empty();
});
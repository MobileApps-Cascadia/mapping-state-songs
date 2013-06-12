//global variables for media playback
var state, my_media, fullStateName, newSrcFile=true;

$(document).ready(function () {
      // Call the barcode scanner's scan() function when the scan button is clicked  
    $(".scanButton").click(function() {
        scan();
    });
      // Call the Media.stopAudio() function when the stop button is clicked  
    $('#stop').click(function() {
        stopAudio();
    });
});
 /* The scan() function.  The scan function is set up to scan a QR code,
    store the string resulting from the scan into a variable named state,
    and navigate to the state page template.
    The function assumes that the string contains the 2-letter state abbreviation
    as this is what will be needed to populate the state data fields. 

    Scanner code updated to reflect new requirements of updated BarcodeScanner plugin on 06/11/2013 */
function scan() {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.scan(
        function (result) {
            if(result.cancelled){ //Go back to the main page if no luck scanning
                // Stop the currently playing song if one is playing
                stopAudio();           
                $.mobile.changePage('#home');
            } else {
                // Stop the currently playing song if one is playing
                stopAudio();           
                // retrieve the state url from the "song" string via AJAX call (TODO).
                state = result.text;   
                // Navigate to the page specified by first part of string.         
                $.mobile.changePage( '#second' );            
                // Automatically start playback of the state song (from local asset.)
                updateState();
            }
    }, 
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

// Audio player
//

// Play audio
function playAudio(src) {
    // Create Media object from src
    if (!my_media || newSrcFile) { //check to see if the src has been changed or is missing
    	my_media = new Media(src, onSuccess, onError, onStatusChange);
    	newSrcFile = false; //reset flag
    }
    my_media.play();
}

// Pause audio
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio
function stopAudio() {
    if (my_media) {
        my_media.stop();
        my_media.release(); // release the device resources
    }
}

// onSuccess Callback
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback 
function onError(error) {
    alert('media play error code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

// onStatus Callback
function onStatusChange(status) {
    //console.log(status);
    if(status==2){ //song is playing, set button to pause - SINGLE SONG ONLY
        $('div.song>div:first').unbind('click').addClass('paused').click(function(){pauseAudio()});
    }
    else if(status==3){ //song is paused, set button to play - SINGLE SONG ONLY
        $('div.song>div:first').unbind('click').removeClass('paused').click(function(){playAudio(assetsURL+songURL)});    
    }    
}
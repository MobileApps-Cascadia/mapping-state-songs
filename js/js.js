//global variables for media playback
var state, my_media, fullStateName;

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
 /* The scan() function.  Currently the scan function is set up to parse a specifically formatted
    string returned from the QR code. The function assumes that the string contains the destination
    url first and then the song url separated by a space. */
function scan() {
    window.plugins.barcodeScanner.scan(
        function(result) {
            // Stop the currently playing song if one is playing
            stopAudio();           
            // retrieve the state url from the "song" string via AJAX call (TODO).
            state = result.text;   
            // Navigate to the page specified by first part of string.         
            $.mobile.changePage( '#second' );            
            // Automatically start playback of the state song (from local asset.)
            updateState();
    }, function(error) {
        alert("Scan failed: " + error);
    });
}

// Audio player
//

// Play audio
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError, onStatusChange);
    // Play audio
    $(this).attr('src', pauseButton);
    $(this).unbind('click');
    $(this).click(pauseAudio(src));

    my_media.play();

    
}

// Pause audio
function pauseAudio(src) {
    if (my_media) {
        my_media.pause();

        $(this).attr('src', playButton);
        $(this).unbind('click');
        $(this).click(playAudio(src));

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
    alert('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

// onStatus Callback
function onStatusChange(status) {
    console.log(status);
}
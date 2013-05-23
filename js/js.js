$(document).ready(function() {
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
            // retrieve the song url from the string and store it in the "song" variable.
            var state = result.text;   
            // Navigate to the page specified by first part of string.         
            $.mobile.changePage( 'second' );            
            // Automatically start playback of the state song.
            playAudio( song );
    }, function(error) {
        alert("Scan failed: " + error);
    });
}

// Audio player
//
var my_media = null;
var mediaTimer = null;

// Play audio
//
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
}

// Pause audio
// 
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio
// 
function stopAudio() {
    if (my_media) {
        my_media.stop();
        // release the device resources upon stopping playback
        my_media.release();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback 
//
function onError(error) {
    alert('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

// Set audio position
// 
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}
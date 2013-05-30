var song,
    songList,
    redHeart,
     blankHeart,
     playButton,
     pauseButton,
     db;
var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
// wait until the device is ready
document.addEventListener("deviceready", onDeviceReady, false);
// Cordova is ready
//
function onDeviceReady() {
	console.log("device ready");
	db = window.openDatabase("StateTuning", "1.0", "StateTuning", 200000);
	db.transaction(setUpDB, errorCB, successCB);

    //Set the path for the hearts one time in a variable since they will be altered in several spots
	if (deviceType == 'Android') {
	    redHeart = '/android_asset/www/images/redHeart.png';
	    blankHeart = '/android_asset/www/images/blankHeart.png';
	    playButton = '/android_asset/www/images/play.png';
	    pauseButton = '/android_asset/www/images/pause.png';
	}
	else {
	    redHeart = 'images/redHeart.png';
	    blankHeart = 'images/blankHeart.png';
	    playButton = 'images/play.png';
	    pauseButton = 'images/pause.png';
	}

}


        function setUpDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS StateTuning (id INTEGER primary key, state, song)'); //Creating the table of it doesn't exist
        }


        //
        function likeSongDB(tx) {
            console.log('INSERT INTO StateTuning (state, song) VALUES ("' + state + '", "' + song + '")');
            tx.executeSql('INSERT INTO StateTuning (state, song) VALUES ("' + state + '", "' + song + '")'); //Inserting two records for testing

        }
        // Query all of the database
        //
        function queryDB(tx) {
            tx.executeSql('SELECT * FROM StateTuning', [], querySuccess, errorCB); // Quering the data
        }

        // Query the success callback
        //
        function querySuccess(tx, results) {
            var len = results.rows.length;
            console.log("StateTuning table: " + len + " rows found.");
            for (var i = 0; i < len; i++) {
                console.log("Row = " + i + " ID = " + results.rows.item(i).id + " State =  " + results.rows.item(i).state + " Song = " + results.rows.item(i).song);
            }
        }

        // Transaction error callback
        //
        function errorCB(err) {
            console.log("Error processing SQL: " + err.code);
        }

        // Transaction success callback
        //
        function successCB() {
            var db = window.openDatabase("StateTuning", "1.0", "StateTuning", 200000);
            db.transaction(queryDB, errorCB);
        }


        //============================================================================================================
function updateState()
	{
	console.log("starting Update State");
	$.ajax({
            type: 'GET',
            url: 'http://statetuned.cascadia.edu/services/state_list/' + state,
			dataType: 'json',
			success: updateTitle
	});

		
		
	$.ajax({
		type: 'GET',
		url: 'http://statetuned.cascadia.edu/services/state_tunes/' + state,
		dataType: 'json',
		success: replacepage
     });
}

function updateTitle(data){
	console.log(state);

}

function replacepage(data) {

    //creates list of songs with the likes
    $.each(data.tunes, function (key, item) {
        $('#statesongs').append('<li id="song" data-song=' + item.content + '><img class="mediaButton" src="images/play.png">' + item.content + '<img class="likeButton" src="' + blankHeart + '"></li>');;
        $('#Statesongs li:last .mediaButton').click(playAudio(item.content));
    });

        //picture
        var sizeSuffix = deviceType=="iPad"?"-med.png": "-small.png";
        $("#statepic").attr("src", 'images/' + state + sizeSuffix);


        $('.likeButton').click(function () {
            song = $(this).parent().data('song');
            //state = $('#state').data('state');

            db.transaction(likeSongDB, errorCB, successCB);
            $.ajax({
                url: "http://216.186.69.45/services/like_tune/" + song,
                type: 'PUT',
                success: function (response) {
                    console.log('PUT Completed');
                }
            })
            $(this).attr("src", redHeart);
            $(this).unbind("click");

        });
		
}
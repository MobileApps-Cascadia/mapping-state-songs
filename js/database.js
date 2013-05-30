var url = "http://statetuned.cascadia.edu/",
	servicesURL = url+"services/",
	assetsURL = url+"assets/",
	song,
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
	/*//if (deviceType == 'Android') {
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
	//}*/
}


        function setUpDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS StateTuning (id INTEGER primary key, state, song)'); //Creating the table of it doesn't exist
        }


        //
        function likeSongDB(tx) {
            console.log('INSERT INTO StateTuning (state, song) VALUES ("' + state + '", "' + songID + '")');
            tx.executeSql('INSERT INTO StateTuning (state, song) VALUES ("' + state + '", "' + songID + '")'); //Inserting two records for testing

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
 	fullStateName = data.state[0].name;
 	$("#statename").html(fullStateName);
}

function replacepage(data) {
		/* Create a single song listing with the like heart as grey */
        $('#statesongs').html('<li id="song" data-song=' + data.tunes[0].id + '><a href="#" class="btn large" onclick="playAudio(' + assetsURL+data.tunes[0].content + ')"><img src="images/play.png"></a><a href="#" class="btn large" onclick="pauseAudio()"><img src="images/pause.png"></a>' + fullStateName + ' <img class="likeButton" src="images/blankHeart.png"></li>');
        playAudio(assetsURL+data.tunes[0].content);       
       
/* TODO: when we have more than one song this will create a list of songs with the likes
    $.each(data.tunes, function (key, item) {
        $('#statesongs').append('<li id="song" data-song=' + item.content + '><img class="mediaButton" src="images/play.png">' + item.content + '<img class="likeButton" src="' + blankHeart + '"></li>');;
        $('#Statesongs li:last .mediaButton').click(playAudio(item.content));
    });
*/
        //Update the state picture
        var sizeSuffix = deviceType=="iPad"?"-med.png": "-small.png";
        $("#statepic").attr("src", 'images/' + state + sizeSuffix);


        $('.likeButton').click(function () {
            var songID = $(this).parent().data('songID');
            //Update the DB with a song LIKE
            db.transaction(likeSongDB, errorCB, successCB);
            $.ajax({
                url: "http://216.186.69.45/services/like_tune/" + songID,
                type: 'PUT',
                success: function (response) {
                    console.log('PUT Completed');
                }
            });
            //Change the heart image and remove the click functionality
            $(this).attr("src", "images/redHeart.png");
            $(this).unbind("click");

        });
		
}
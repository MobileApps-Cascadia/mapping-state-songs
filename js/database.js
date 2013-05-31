var url = "http://statetuned.cascadia.edu/",
	servicesURL = url+"services/",
	assetsURL = url+"assets/",
	songID,
	fullStateName,
    //songList,
    //playButton,
    //pauseButton,
    db;
var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
// wait until the device is ready
document.addEventListener("deviceready", onDeviceReady, false);
// Cordova is ready
//
function onDeviceReady() {
	console.log("device ready");
	db = window.openDatabase("StateTuning", "1.0", "StateTuning", 200000);
	db.transaction(setUpDB, errorCB, console.log('Database SetUp'));

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

    /*TESTING PURPOSES - UNCOMMENT IF YOU DO NOT HAVE SOMETHING TO SCAN
	state = 'AZ';
	updateState();
    */
}

        function setUpDB(tx) {
           //tx.executeSql('DROP TABLE IF EXISTS StateTuning'); //this line is for testing the database
            tx.executeSql('CREATE TABLE IF NOT EXISTS StateTuning (id INTEGER primary key, state, songID)'); //Creating the table of it doesn't exist
        }


        //
        function likeSongDB(tx) {
        	var sqlInsert = 'INSERT INTO StateTuning (state, songID) VALUES ("' + state + '", "' + songID + '")';
            tx.executeSql(sqlInsert, [], console.log("successful insert: "+sqlInsert),console.log("insert error: "+sqlInsert);
        }
        // Query all of the database
        //
        function queryDB(tx) {
            tx.executeSql("SELECT * FROM StateTuning WHERE state ='" + state + "'", [], querySuccess, errorCB); // Quering the data for a single SongID (CHANGE WHEN MULTIPLE SONGS ARE ASSOCIATED)
        }

        // Query the success callback
        //
        function querySuccess(tx, results) {
            var len = results.rows.length;
            console.log("StateTuning table: " + len + " rows found.");
            for (var i = 0; i < len; i++) {
                console.log("Row = " + i + " ID = " + results.rows.item(i).id + " State =  " + results.rows.item(i).state + " Song = " + results.rows.item(i).songID);
            }
            if (len == 0) {
                $('#song').append('<img class="likeButton" src="images/blankHeart.png">');

                $('.likeButton').click(function () {
                    songID = $(this).parent().data('songid');
                    //Update the DB with a song LIKE
                    db.transaction(likeSongDB, errorCB, console.log('Like was logged'));
                    $.ajax({
                        url: "http://216.186.69.45/services/like_tune/" + songID,
                        type: 'PUT',
                        success: function (response) {
                            console.log('Logged in the external database');
                        }
                    });
                    //Change the heart image and remove the click functionality
                    $(this).attr("src", "images/redHeart.png");
                    $(this).unbind("click");

                });
            }
            else
                $('#song').append('<img class="likeButton" src="images/redHeart.png">');


        }

        // Transaction error callback
        //
        function errorCB(err) {
            console.log("Error processing SQL: " + err.code);
        }

        // Transaction success callback
        //
        function successCB() {
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
    db.transaction(queryDB, errorCB);

        /* Create a single song listing with the like heart as grey */
        $('#statesongs').html('<li id="song" data-songid=' + data.tunes[0].id + '><a href="#" class="btn large" onclick="playAudio(\'' + assetsURL+data.tunes[0].content + '\')"><img src="images/play.png"></a><a href="#" class="btn large" onclick="pauseAudio()"><img src="images/pause.png"></a>' + fullStateName + ' State Song </li>');
        playAudio(assetsURL+data.tunes[0].content);       
       
/* TODO: when we have more than one song this will create a list of songs with the likes. Need to fix heart references
    $.each(data.tunes, function (key, item) {
        $('#statesongs').append('<li id="song" data-song=' + item.content + '><img class="mediaButton" src="images/play.png">' + item.content + '<img class="likeButton" src="' + blankHeart + '"></li>');;
        $('#Statesongs li:last .mediaButton').click(playAudio(item.content));
    });
*/
        //Update the state picture
        var sizeSuffix = deviceType=="iPad"?"-med.png": "-small.png";
        $("#statepic").attr("src", 'images/' + state + sizeSuffix);
       
}
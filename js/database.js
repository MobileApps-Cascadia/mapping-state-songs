        var song,
            state,
            songList; 

        // wait until the device is ready
        document.addEventListener("deviceready", onDeviceReady, false);

        //Perform actions on device ready


        function setUpDB(tx) {
            tx.executeSql('DROP TABLE IF EXISTS StateTuning'); // for testing purposes. remove from final product!
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

        function scanGrabSongs() {
            $.get('http://216.186.69.45/state_tunes/' + state, function (data) {
                songList = data; //LUCAS YOU CAN WORK WITH THIS VARIABLE FOR THE LIST OF SONGS
                console.log(songList); // DELETE AFTER TESTING
            });
        }

        // Cordova is ready
        //
        function onDeviceReady() {
            var db = window.openDatabase("StateTuning", "1.0", "StateTuning", 200000);
            db.transaction(setUpDB, errorCB, successCB);

            $('.likeButton').click(function () {
                song = $(this).parent().data('song');
                state = $('#state').data('state');

                db.transaction(likeSongDB, errorCB, successCB);
                $.ajax({
                    url: "http://216.186.69.45/services/like_tune/" + song,
                    type: 'PUT',
                    success: function (response) {
                        console.log('PUT Completed');
                    }
                })
                $(this).attr("src",'images/redHeart.png');
            });

            scanGrabSongs();
        }


        //============================================================================================================
function updateState(state)
	{
	
	$.ajax(
	{
            type: 'GET',
            url: 'http://216.186.69.45/services/state_list/' + state,
			dataType: 'json',
			onSuccess: function(){$("#statename").html(state.name);
	}
	});

		
		
		$.ajax({
			type: 'GET',
	url: 'http://216.186.69.45/services/state_tunes/' + state,
	dataType: 'json',
	onSuccess: replacepage
        });


}


		function replacepage()
		{
			//name			
        $("#statename").html(state.name);

		//creates list of songs with the likes
        var theWholeThing;
        for (I = 0; I < tunes.length; I++)
        {
            theWholeThing += "<li id=\"song\" data-song=\"5\"><a href=\"#\" class=\"btn large\" onclick=\"playAudio('" + tunes[I].content + "');\"><img src=\"images/play.png\"></a><a href=\"#\" class=\"btn large\" onclick=\"pauseAudio();\"><img src=\"images/pause.png\"></a>" + tunes[I].content + " likes = " + tunes.likes + "</li>"
				            //"<li id=\"song\" data-song=\"5\"><a href=\"#\" class=\"btn large\" onclick=\"playAudio('" + songurl + "');\"><img src=\"images/play.png\"></a><a href=\"#\" class=\"btn large\" onclick=\"pauseAudio();\"><img src=\"images/pause.png\"></a>" + song.name + "</li>"
        }
        document.getElementById('listOfSongs').innerHTML = theWholeThing;


        //picture
        var thepath = "images/" + state + "-small.png"
        $("#statepic").attr("src", thepath);
		
		}
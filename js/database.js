var url = "http://statetuned.cascadia.edu/",
    servicesURL = url+"services/",
    assetsURL = url+"assets/",
    songID,
    songURL,
    fullStateName,
    db;
var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
// wait until the device is ready
document.addEventListener("deviceready", onDeviceReady, false);
// Cordova is ready
//
function onDeviceReady() {
    console.log("device ready");
    db = window.openDatabase("StateTuning", "1.0", "StateTuning", 100000);
    db.transaction(setUpDB, errorDB, successDB);
    /*TESTING PURPOSES - UNCOMMENT IF YOU DO NOT HAVE SOMETHING TO SCAN
    state = 'AZ';
    updateState();
    */
}
    //Creating the table of it doesn't exist
        function setUpDB(tx) {
           //tx.executeSql('DROP TABLE IF EXISTS StateTuning'); //this line is for testing the database
            tx.executeSql('CREATE TABLE IF NOT EXISTS StateTuning ( state unique, songID)'); 
        }
    // Logging a Like for a song locally
        function likeSongDB(tx) {
            tx.executeSql('INSERT INTO StateTuning (state, songID) VALUES ("' + state + '", ' + songID + ')');
        }
   // Query the database for a row with this State
        function queryDB(tx) {
            tx.executeSql("SELECT * FROM StateTuning WHERE state ='" + state + "'", [], querySuccess); 
        }

   // Test for State match after a successful query
        function querySuccess(tx, results) {
            var len = results.rows.length;
            /* //Loop through the results
            console.log("StateTuning table: " + len + " rows found.");
            for (var i = 0; i < len; i++) {
                console.log("Row = " + i + " ID = " + results.rows.item(i).id + " State =  " + results.rows.item(i).state + " Song = " + results.rows.item(i).songID);
            }*/
            if (len == 0) { // The current State is not in the DB           
                $('.likeButton').click(function () {
                    var songID = $(this).parent().data('songid');
                    //Update the DB with a song LIKE
                    db.transaction(likeSongDB, errorDB, console.log('Like was logged'));
                    $.ajax({
                        url: servicesURL + "like_tune/" + songID,
                        type: 'PUT',
                        success: function (response) {
                            console.log('Logged in the external database');
                        }
                    });
                    //Change the heart image and remove the click functionality
                    $(this).addClass('liked');
                    $(this).unbind("click");

                });
            }
            else // Found the State locally
                $('.likeButton').addClass('liked');
        }

        // Transaction error callback
        //
        function errorDB(err) {
            console.log("Error with SQL: " + err.code + ", message: "+err.message);
        }
        function successDB(){
             console.log('Database SetUp Successful');
        }

        //============================================================================================================
function updateState()
    {
    // Get the list of state info and set the page title
    $.ajax({
            type: 'GET',
            url: servicesURL + 'state_list/' + state,
            dataType: 'json',
            success: updateTitle
    });
    // Get the list of Tunes and finish the State page
    $.ajax({
        type: 'GET',
        url: servicesURL + 'state_tunes/' + state,
        dataType: 'json',
        success: replacepage
     });
}

function updateTitle(data){
    fullStateName = data.state[0].name;
    $("#statename").html(fullStateName+" State Tune");
}

function replacepage(data) {
    db.transaction(queryDB, errorDB, console.log("State Tuning queried"));
    songURL = data.tunes[0].content;
    songID = data.tunes[0].id;
        /* Create a single song listing with the like heart unselected and one button that toggle between play and pause */
        $('#statesongs').html('<div class="song" data-songid=' + songID + '><div class="playPauseButton"></div><a href="#map"><div class="mapButton"></div></a><div class="likeButton"></div></div>');
        playAudio(assetsURL+songURL);       
       
/* FUTURE: when we have more than one song this will create a list of songs with the likes. Need to fix heart references
    $.each(data.tunes, function (key, item) {
        $('#statesongs').append('<li id="song" data-song=' + item.content + '><img class="mediaButton" src="images/play.png">' + item.content + '<img class="likeButton" src="' + blankHeart + '"></li>');;
        $('#Statesongs li:last .mediaButton').click(playAudio(item.content));
    });
*/
        //Update the state picture
        var sizeSuffix = deviceType=="iPad"?"-medium.png": "-small.png";
        $("#statepic").attr("src", 'images/' + state + sizeSuffix);       
}
function getArtists() {
    // Create a cache object
    var cache = new LastFMCache();
    // Create a LastFM object
    var lastfm = new LastFM({
        apiKey: '828c109e6a54fffedad5177b194f7107',

        apiSecret: '7c2f09e6eb84e8a6183c59e0bc574f70',
        cache: cache
    });

    //retreiving username from input
    var retrieve_user = document.getElementById("user-form");
    var temp_user = retrieve_user[0];
    var user_name = temp_user.value;

    //retreiving results amount from input
    var retrieve_num = document.getElementById("results-form");
    var temp_num = retrieve_num[0];
    var results_amount = temp_num.value;

    //checkpoint to ensure username is passed correctly
    //alert(results_amount);
    //alert(user_name);

    //checkpoint for correct results_amount
    if (results_amount > 50 || results_amount < 2 || results_amount == null) {
        alert("Enter a valid range (2-50).");
        location.reload();
    }

    //workhorse function call
    getTopArtists(user_name, results_amount);

    //workhorse function definition
    function getTopArtists(user, limit) {

        //submit button disabler
        document.getElementById("enter").disabled = true;

        // Get the top artists for this user
        lastfm.user.getTopArtists({ //params
            user: user,
            limit: limit
        }, { //callbacks
            success: function(data) {

                //padding to a consistant amount of characters
                function zeroPad(num, places) {
                    var zero = places - num.toString().length + 1;
                    return Array(+(zero > 0 && zero)).join("0") + num;
                }

                var artists = new Array(limit);
                var artists_playcount = new Array(limit);
                for (var i = 0; i < limit; i++) {
                    artists[i] = data.topartists.artist[i].name;
                    artists_playcount[i] = data.topartists.artist[i].playcount;
                    //adjusting with the zeroPad function
                    artists_playcount[i] = zeroPad(artists_playcount[i], artists_playcount[0].toString().length);
                }
                var graphdata = {
                        labels: artists,
                        datasets: [{
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            data: artists_playcount
                        }]
                    }
                //Chart.js init
                var ctx = document.getElementById("myChart").getContext("2d"); //2d context of chart location
                ctx.canvas.width = window.innerWidth / 1.25;
                ctx.canvas.height = window.innerHeight / 1.75;

                var myNewChart = new Chart(ctx).Line(graphdata);
            }
        });
        //remove the welcome banner (happens if failed user or if everyhing flows correctly)
        var wel = document.getElementById("welcome");
        wel.parentNode.removeChild(wel);

    } //END***getTopArtists***END
} //END***getArtists***END
//reload page function

function changeHeight() {
    $('body').css('overflow', 'hidden');
    var height = $(window).height();
    document.getElementById('keep-inside').style.height = height; //document.documentElement.clientHeight;

}

function reloadPage() {
    location.reload();
}

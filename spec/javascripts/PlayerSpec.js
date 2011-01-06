describe("Player", function() {

  //added to try and make jasmine run
  // overcame a number of errors, now it fails silently
//  google = {
//    maps: {
//      LatLng: function() {},
//      MapTypeId: {
//        'ROADMAP': null
//      },
//      Map: function(){},
//      InfoWindow: function(){}
//    }
//  };
  AUTH_TOKEN = null;

//a different attempt to get the remote .js files to load
//still doesn't work
  function addScript(path) {
    var doc = window.document || win.getDocument();
    var head = doc.getElementsByTagName("head")[0] ||
        document.documentElement;
    var script = doc.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    head.appendChild(script);
  }
  addScript("https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js");
  addScript("http://maps.google.com/maps/api/js?sensor=true");

  var player;
  var song;

  beforeEach(function() {
    player = new Player();
    song = new Song();
  });

  it("should be able to play a Song", function() {
    player.play(song);
    expect(player.currentlyPlayingSong).toEqual(song);

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });

  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(
            function() {
              player.resume();
            }).toThrow("song is already playing");
    });
  });
});
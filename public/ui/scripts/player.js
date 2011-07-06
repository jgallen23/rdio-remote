var player;
var rdioListener = {
  ready: function() {
    player = document.getElementById("Player");
    window.player = player;
    var song = songs[1];
    console.log(song);
    player.rdio_play(songs[1].key);
  },
  playStateChanged: function(state) {
    console.log(state);
  },
  playingSomewhereElse: function() {
    console.log("playing somewhere else");
  }
};
var flashvars = {
  playbackToken: playbackToken,
  domain: encodeURIComponent(document.domain),
  listener: 'rdioListener'
};
var params = {
  'allowScriptAccess': 'always'
};
swfobject.embedSWF("http://www.rdio.com/api/swf/", "Player", "1", "1", "9.0.0","", flashvars, params);

var socket = io.connect("http://me.jga23.com:3000");
socket.emit('player');
socket.on('pause', function() {
  console.log("pause");
  player.rdio_pause();
});


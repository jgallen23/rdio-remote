var RemoteController = $.Fidel.extend({
  init: function() {
    this._initSocket();
  },
  _initSocket: function() {
    var self = this;
    this.socket = io.connect("http://me.jga23.com:3000");
    this.socket.emit('remote', '123', '', function(token) { //token, authKey, cb
      self.token = token;
      self.trigger('ready');
    });
  },
  pause: function() {
    console.log("pause");
    this.socket.emit("pause", this.token);
  },
  play: function(key) {
    console.log("play", key);
    this.socket.emit('play', this.token, key);
  }
});

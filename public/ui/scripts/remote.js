var socket = io.connect("http://me.jga23.com:3000");
socket.emit('remote');
$("button").bind("click", function() {
  socket.emit("pause");
});

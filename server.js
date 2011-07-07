var express = require("express"),
    path = require("path"),
    stylus = require("stylus");

var config = require('./config');
var app = express.createServer();
var io = require('socket.io').listen(app);

var ui = function(req, res, next) {
  res.local("scripts", []);
  res.local("stylesheets", []);
  res.local("pageTitle", "");
  next();
};

app.configure(function() {
  app.use(ui);
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
      secret: config.sessionSecret 
  }));
  app.use(app.router);
  app.helpers({
    inProduction: (process.env.NODE_ENV === 'production')
  });
  app.dynamicHelpers({
    session: function(req, res){
      return req.session;
  }
  });
  app.set("views", "" + __dirname + "/views");
  app.set("view options", {
    layout: false 
  });
  app.set("view engine", "jade");

  var stylusCompile = function(str, path) {
    return stylus(str).set('filename', path).set('compress', true);
  };

  app.use("/ui", stylus.middleware({
    src: __dirname + '/public/ui',
    dest: __dirname + '/public/ui',
    compile: stylusCompile
  }));

  app.use(express.static(__dirname + "/public"));
});
app.configure("development", function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure("production", function() {
  app.use(express.errorHandler());
});

//setup rdio
var rdio = require('rdio')({
  rdio_api_key: config.rdioAPIKey,
  rdio_api_shared: config.rdioAPIShared,
  callback_url: config.host+":"+config.port+"/oauth/callback"
});

//Routes
require('./routes/login')(app, config, rdio);
require('./routes/player')(app, config, rdio);
require('./routes/remote')(app, config, rdio);

//Sockets
var players = {},remote;
var generateToken = function(token) {
  //check if token valid
  if (token)
    return token;
  else
    return '123';//Math.round(Math.random()*10000000); //TODO: better token
};
io.sockets.on('connection', function(socket) {
  socket.on('player', function(token, fn) {
    token = generateToken(token);
    fn(token);
    players[token] = {
      socket: socket,
      remotes: []
    };
  });
  socket.on('remote', function(token, authKey, fn) {
    if (authKey) {//check authkey
    } else if (token) {
      console.log(token);
      players[token].remotes.push(socket);
      fn(token);
      socket.set('token', token);
    }
    socket.on('play', function(token, key) {
      players[token].socket.emit('play', key);
    });
    socket.on('pause', function(token) {
      players[token].socket.emit('pause');
    });
  });
});

app.listen(config.port, "0.0.0.0");

var url = require('url');

module.exports = function(app, config, rdio) {
  
  app.get('/', function(req, res) {

    rdio.api(
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      {
        method: 'getTopCharts',
        type: 'Track',
        count: 10
      }, function(err, data, response) {
        if(err) throw new Error(err);
        var songs = JSON.parse(data);
        
        rdio.getPlaybackToken(
          req.session.oauth_access_token,
          req.session.oauth_access_token_secret,
          config.host,
          function(err, data, response) {
            if(err) throw new Error(err);
            res.render('player', {
              playbackToken: JSON.parse(data).result,
              songs: songs.result
            });
          }
        );
      }
    );
  });

};

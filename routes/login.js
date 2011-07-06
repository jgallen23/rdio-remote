var url = require('url');
module.exports = function(app, config, rdio) {
  app.get('/oauth/login', function(req, res, params) {
    if(!req.session.oauth_access_token) {
      rdio.getRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if(error) {
          throw new Error(error);
        } else { 
          // store the tokens in the session
          req.session.oauth_token = oauth_token;
          req.session.oauth_token_secret = oauth_token_secret;

          // redirect the user to authorize the token
          res.redirect(rdio.config.rdio_oauth_auth+oauth_token);
        }
      });
    } else {
      res.redirect("/");
    }
  });

  app.all('/oauth/callback', function(req, res, params) {
    var parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);
    rdio.getAccessToken(parsedUrl.query.oauth_token, req.session.oauth_token_secret, parsedUrl.query.oauth_verifier, 
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        console.log(error);
        req.session.oauth_access_token = oauth_access_token;
        req.session.oauth_access_token_secret = oauth_access_token_secret;
        res.redirect("/");
      }
    );
  });
};

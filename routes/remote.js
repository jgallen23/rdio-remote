
module.exports = function(app, config, rdio) {
  app.get('/remote', function(req, res) {
    res.render('remote');
  });
};

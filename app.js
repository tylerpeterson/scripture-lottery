
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var nib = require('nib');
var stylus = require('stylus');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    // .set('compress', true)
    .use(nib());
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(stylus.middleware({
  src: path.join(__dirname, 'public'),
  compile: compile
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/bofm', routes.bofm);
app.get('/users', user.list);
app.get('*', routes.e404);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

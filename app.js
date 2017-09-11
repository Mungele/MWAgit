var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var fetch = require('node-fetch');

var Rx = require ('@reactivex/rxjs');

var index = require('./routes/index');
var users = require('./routes/users');
//var port = 3000;
var app = express();
const jsonplaceholder = 'http://jsonplaceholder.typicode.com/users/';


//  setup
app.set('env','development');
app.set('trust proxy',true);
app.enable('trust proxy');
app.set('case sensitive routing',true);
app.enable('case sensitive routing');
app.set('strict routing', true);
app.set('view cache',true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
const port = app.get('port');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);

app.get('/',function (request,response){
    response.render('index',{title:'Express'});
});

/*app.get('/users',function (request,response){

 const json_users = fetch(jsonplaceholder);
    json_users
        .then(function(res) {return res.json();})
        .then(function(json) {
             response.render('users',{items:json });
             response.end();
        })
        .catch(function(err) {
            console.log(err);
        });
	//response.render('users',{title:'Express'});
});*/

/* async function getJson(){
    try {
        let json_promise = await
        fetch(jsonplaceholder);
    } catch (error){
        console.log(error.message);
    }
}*/

app.get('/users', function (request,response ){
    var Observer_json_users = Rx.Observable.fromPromise(fetch(jsonplaceholder))
        .map(function(res) {return res.json();})
        .map(function(json) {
            //response.render('users',{items:json });
            response.send(console.log('Inside the map' +json));
            response.end();
        })
        .subscribe( function(e){ console.log(e);},
            function(err){console.error(err);},
            function (){console.info('done');});
});

app.listen(port,function(){
	console.log('The server is running on port %s', port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

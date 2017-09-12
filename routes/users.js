var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var Rx = require ('@reactivex/rxjs');
var jsonplaceholder = 'https://jsonplaceholder.typicode.com/users';

//var Rx = require('rxjs/Rx');

/* GET users listing. */
router.get('/', function(req, res) {
  //res.render('users', { title: 'Express' });
  res.send('respond with a resource');
});


router.get('/promise',function (request,response){

 var json_users = fetch(jsonplaceholder);
 json_users.then(function(res) {return res.json();})
 .then(function(json) {
 response.render('users',{items:json });
 response.end();
 })
 .catch(function(err) {
 console.log(err);
 });
 //response.render('users',{title:'Express'});
 });

router.get('/observer', function (request,response ){
    Rx.Observable.fromPromise(fetch(jsonplaceholder))
        .flatMap(function(res) {return res.json();})
        .subscribe(function(json) {
            response.render('users',{items:json });
            //response.send(console.log('Inside the map' +json));
            response.end();
            },
            function(err){console.error(err);},
            function (){console.info('done');});
});

router.get('/async',function(req, res){
    getJson(req,res);
});

async function getJson(req,res){
  try {
    var json_promise = fetch(jsonplaceholder);
    var result = await json_promise;
    res.render('users', { title:'users', items: result});
  } catch (error){
    console.log(error.message);
  }
}

module.exports = router;

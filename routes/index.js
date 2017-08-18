var express = require('express');
var http = require('http')
var router = express.Router();

var policies = []


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Design' });
});

router.post('/compile', function (req, res, next) {

    const options = {
        hostname: '101.6.30.156',
        port: 10888,
        path: '/',
        method: 'POST'
    };
    var reqest = http.request(options,function (data) {
        data.on('data',function (chunk) {

        });
    });

    console.log(req.body.data);
    reqest.write(req.body.data);
    policies.push(req.body.data);
    reqest.end();
    res.end();
});

router.get('/policies', function (req, res, next) {
    var str = ""
    for(var p in policies) {
        str = str + '*' + policies[p]
    }
    res.send(str)
});


var c = 0;

router.get('/s1', function (req, res, next) {
    var str = "" + c + " Kbps";
    c = c + 1;
    res.send(str)
});

router.get('/s2', function (req, res, next) {
    var str = "" + c + " Kbps";
    c = c + 1;
    res.send(str)
});

router.get('/s3', function (req, res, next) {
    var str = "" + c + " Kbps";
    c = c + 1;
    res.send(str)
});

router.get('/s4', function (req, res, next) {
    var str = "" + c + " Kbps";
    c = c + 1;
    res.send(str)
});

router.get('/s5', function (req, res, next) {
    var str = "" + c + " Kbps";
    c = c + 1;
    res.send(str)
});



module.exports = router;

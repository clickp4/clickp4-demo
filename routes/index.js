var express = require('express');
var http = require('http')
var router = express.Router();

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
    reqest.end();
    res.end();
});


module.exports = router;

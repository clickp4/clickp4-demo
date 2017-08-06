var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('design', { title: 'Design' });
  console.log('Get design page');
});

module.exports = router;
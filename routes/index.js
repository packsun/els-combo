var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Elsword Combo Simulator' });
});

/* GET home page. */
router.get('/BM', function(req, res, next) {
	res.render('BM', { title: 'Blade Master' });
});


module.exports = router;

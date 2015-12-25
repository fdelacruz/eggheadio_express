var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

var router = express.Router({
	mergeParams: true
});

router.use(function (req, res, next) {
	console.log(req.method, 'for', req.params.username, ' at ' + req.path);
	next();
});

// delete helpers.verifyUser to trigger error
router.get('/', function (req, res) {
	var username = req.params.username;
	var user = helpers.getUser(username);
	res.render('user', {
		user: user,
		address: user.location
	});
});

// error handling middleware
router.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

router.put('/', function (req, res) {
	var username = req.params.username;
	var user = helpers.getUser(username);
	user.location = req.body;
	helpers.saveUser(username, user);
	res.end();
});

router.delete('/', function (req, res) {
	var fp = helpers.getUserFilePath(req.params.username);
	fs.unlinkSync(fp); // delete the file
	res.sendStatus(200);
});

module.exports = router;

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var oUnsplashPhotoSearcher = require('./js/unsplashPhotoSearcher.js');

var app = express();
app.use(express.static(path.resolve(__dirname, 'public')));

// Below two middlewares only applies to POST requests
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/searchUnsplashPhotos', function (req, res) {
	oUnsplashPhotoSearcher.search(function (pPhotos) {
		res.json(pPhotos);
	});
});

var server = app.listen(process.env.PORT || 3000, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});
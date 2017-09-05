'use strict';

var express = require('express');

var bodyParser = require('body-parser');

var router = require('./routes.js');

var app = express();

app.set('port', process.env.PORT || 5000);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(router);

// spin spin sugar
app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'));
});

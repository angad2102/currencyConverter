'use strict';

/**
* Module Dependencies 
*/

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exchange = require('./exchange')(app); //Routing and Logic
const port =  process.env.PORT || 3000;

/**
* Listen function to start listening for requests
*/

function listen () {
	
	if (app.get('env') === 'test') return;
  	app.listen(port);
  	console.log('Express app started on port ' + port);
}


/**
* Expose
*/
app.use(express.static(__dirname + '/public'));

listen(); //start listening for requests

module.exports = app;

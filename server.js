process.env.NODE_ENV = process.env.NODE_ENV || 'development'; /*development, staging, production*/

var exp = require('express');
var config = require('./configs/configs');
var express = require('./configs/express');
var mongoose = require('./configs/mongoose');

if (global.permission) {

} else {
	global.permission = [];
}

var db = mongoose();
var app = express();

/* Old path for serving public folder */
// app.use(exp.static(__dirname + './../public'));
/* To serve the folder (We are using it for images (public/upload), PDF(public/pdf, doc(public/docx) etc. etc.) */
app.use(exp.static(__dirname + '/'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json()); 

app.get('/', function(req, res) {
	res.end("This is the API");
});

app.listen(config.serverPort);
console.log('Server running at http://localhost:' + config.serverPort + '/');
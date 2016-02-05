'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');

var port = process.env.PORT || 8000;

var DB_URI = require('./config/userSettings').dbUri;
var DB_CRED = require('./config/userSettings').dbCred;

app.use(morgan('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'jade');
app.use(cookieParser());

app.use('/css', express.static(__dirname + '/public/static/css'));
app.use('/js', express.static(__dirname + '/public/static/js'));

mongoose.connect(DB_URI, DB_CRED);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {console.log('db connected')});

require('./config/passportConfig')(app);
require('./config/routes.js')(app, express);


app.listen(port);



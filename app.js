'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const port = process.env.PORT || 8000;

const DB_URI = require('./config/user-settings').dbUri;
const DB_CRED = require('./config/user-settings').dbCred;

app.use(morgan('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'jade');
app.use(cookieParser());

mongoose.connect(DB_URI, DB_CRED);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {console.log('db connected')});

require('./config/passport-config')(app);
const pageStatus = require('./config/helpers/page-status');

app.use('/aPanel', express.static(__dirname + '/public/static/aPanel'));
app.use('/', pageStatus, express.static(__dirname + '/public/dist'));
app.use('/aPanel/style', express.static(__dirname + '/src/style/'));
app.use('/uploads', express.static(__dirname + '/public/dist/uploads'));

require('./config/routes.js')(app, express);

require('./config/helpers/error-handler')(app);

app.listen(port);



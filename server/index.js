const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const app = express();
const apiRouter = express.Router();
//var bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(function (req, res, next) {
    res.tpl = {};
    res.tpl.error = [];
    return next();
});

app.use(session({
    secret : 'mandakkorus',
    resave : true,
    saveUninitialized : true
}));

app.use(function(req, res, next) {
    res.locals.user_id = req.session.user_id;
    res.locals.admin = req.session.admin;
    next();
});
/*
app.use(express.static(path.join(__dirname, './dist/mandak-angular/browser')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/mandak-angular/browser/index.html'));
});
*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // or your Angular dev port
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


//authenticate google using a web browser
//require('./routes/google')();

// require('./routes/routes')(app, fs);
require('./routes/data')(apiRouter, mysql, fs);
require('./routes/repertoire')(apiRouter, mysql);
require('./routes/events')(apiRouter, mysql, fs);
// require('./routes/registration')(app, mysql, bcrypt);
require('./routes/login')(apiRouter, mysql, bcrypt);

app.use('/api', apiRouter);

// app.set('view engine', 'ejs');

// app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
// app.use(express.static(path.join(__dirname, 'public')));



// HTTPS ////////////////////////////////////////////////////

// HTTPS needs certificate
/* const privateKey = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/fullchain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate
};

// HTTP server and redirect to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
  res.end();
});

// HTTPS server
const httpsServer = https.createServer(credentials, app);

// start HTTP
httpServer.listen(80, () => {
  console.log('HTTP server on 80 and redirect to HTTPS.');
});

// start HTTPS
httpsServer.listen(443, () => {
  console.log('HTTPS server on 443.');
});*/

//////////////////////////////////////////////////////////////



// Only HTTP /////////////////////////////////////////////////

http.createServer(app).listen(80, () => {
  console.log(`Server running at http://127.0.0.1:80/`);
});

///////////////////////////////////////////////////////////////
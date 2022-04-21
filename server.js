var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
var PORT = 8080;



app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));

app.get('/', (req, res) => {
	res.render("index")
})

app.get('/about', (req, res) => {
	res.render("about")
})

app.get('/login', (req, res) => {
	res.render("login")
})

// Server
app.listen(PORT, () => console.log(`Server started on port: http://localhost:${PORT}`));


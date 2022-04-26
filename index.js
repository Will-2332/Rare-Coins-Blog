/*const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path= require("path");

const app = express();
app.set("view engine","ejs");

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    res.json({
    })
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/about.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
*/
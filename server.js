const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path= require("path");
const coinsRouter = require("./routes/coinroutes.js");

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
const db = require("./models");
const { application } = require("express");
const Coins = require("./models/coins.js");
const Role = db.role;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//mongoDB connection URI, remember to change 'password' with your password and myFirstDatabase with your database name
const dbURI = 'mongodb+srv://willianmusquim:123mudar@cluster0.iqcxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//using mongoose to connect to MongoDB, the last two option to avoid deprecation warnings.
db.mongoose.connect(dbURI, { useNewUrlParser: true, 

    useUnifiedTopology: true  })
    .then((result) => {
        console.log('connected to database');

    })
    .catch((err) => {
        console.log("connection error", err);
        process.exit();
    });

app

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
    
    app.use(coinsRouter);

    // set port, listen for requests
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });   

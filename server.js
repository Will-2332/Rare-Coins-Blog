const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
//const coinHandler = require("./handlers/coinHandler");
const coinsModel = require("./models/coins");

async function findCoins() {
    const coins = await coinsModel.find({});
    return coins
};

const app = express();
app.set("view engine", "ejs");

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));
const db = require("./models");
const { application } = require("express");

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//mongoDB connection URI, remember to change 'password' with your password and myFirstDatabase with your database name
const dbURI = 'mongodb+srv://willianmusquim:123mudar@cluster0.iqcxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//using mongoose to connect to MongoDB, the last two option to avoid deprecation warnings.
db.mongoose.connect(dbURI, {
    useNewUrlParser: true,

    useUnifiedTopology: true
})
    .then((result) => {
        console.log('connected to database');

    })
    .catch((err) => {
        console.log("connection error", err);
        process.exit();
    });

app.get('/', async (req, res) => {
    res.render("table")
})

/*app.get('/', async (req, res) => {
    console.log("meupauberimbaU");
    // res.sendFile(path.join(__dirname, '/public/index.html'));
    const data = await findCoins();
    ejs.renderFile("/public/index", {coinsList:data}, {}, function(err, str){
        console.log(err)
    res.send(str);

    });
})*/

app.get('/about', (req, res) => {
    res.render("about")
})

app.get('/login', (req, res) => {
    res.render("login")
});

app.get('/', (req, res) => {
    Coins.find({}, function(err, coins) {
        res.render('index', {
            coisList: coins
        })
    })
})

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});   

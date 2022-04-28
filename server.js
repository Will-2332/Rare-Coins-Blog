const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const coinHandler = require("./handlers/coinHandler");
const db = require("./models/index.js");
require('dotenv/config');
const router = express.Router();
const User = require("./models/user.model.js")

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

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//mongoDB connection URI, remember to change 'password' with your password and myFirstDatabase with your database name
const dbURI = process.env.DB_ACESS;

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
        //function helps us to create 2 rows in roles collection
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new Role({
                    name: "admin"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
                    console.log("added 'admin' to roles collection");
                });

                new Role({
                    name: "user"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
                    console.log("added 'user' to roles collection");
                });
            }
        });

    })
    .catch((err) => {
        console.log("connection error", err);
        process.exit();
    });





app.get('/', async (req, res) => {
    // res.sendFile(path.join(__dirname, '/public/index.html'));
    const data = await coinHandler.findCoins();
    ejs.renderFile('./public/index.ejs', { coins: data }, {}, function (err, str) {
        console.log(err);
        res.send(str)
    })
});



app.get('/HelloWorld', async (req, res) => {
    try {
        const data = { user: { name: "CHUPA" } }
        ejs.renderFile('./public/HelloWorld.ejs', data, {}, function (err, str) {
            res.send(str)
        });
    } catch (err) {
        console.error(err);
    }

})

app.get('/about', async (req, res) => {
    try {
        const data = {}
        ejs.renderFile('./public/about.ejs', data, {}, function (err, str) {
            res.send(str)
        });
    } catch (err) {
        console.error(err);
    }

})

app.get('/Login', async (req, res, next) => {
    try {
        const data = {}
        ejs.renderFile('./public/login.ejs', data, {}, function (err, str) {
            res.send(str)
        });
    } catch (err) {
        console.error(err);
    }

})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }
    //check if match
    if (password !== password2) {
        errors.push({ msg: "passwords dont match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({ msg: 'password atleast 6 characters' })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                //save user
                newUser.save()
                    .then((value) => {
                        console.log(value)
                        res.redirect('/login');
                    })
                    .catch(value => { console.log(value) })
            })
        })
    }
});

router.post('/login', (req, res, next) => {
})

app.get('/register', async (req, res) => {

    const data = {}
    ejs.renderFile('./public/register.ejs', data, {}, function (err, str) {
        res.send(str)
    });
})

app.get('/logout', async (req, res) => {
    try {
        const data = {}
        ejs.renderFile('./public/logout.ejs', data, {}, function (err, str) {
            res.send(str)
        });
    } catch (err) {
        console.error(err);
    }

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});   

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
const bcrypt = require('bcrypt')
const passport = require('passport');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
require("./config/passport").passport(passport);
const loggedIn = require("./config/passport").loggedIn;
app.set("view engine", "ejs");
const coinsModel = require('./models/coins');

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use('/public', express.static(__dirname + '/public'))

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//mongoDB connection URI, remember to change 'password' with your password and myFirstDatabase with your database name
const dbURI = process.env.DB_ACESS;
console.log(dbURI)

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
    const data = await coinHandler.findCoins();
    ejs.renderFile('./public/index.ejs', { coins: data }, {}, function (err, str) {
        console.log(err);
        res.send(str)
    })
});

app.get('/table', async (req, res) => {
    const data = await coinHandler.findCoins();
    ejs.renderFile('./public/table.ejs', { coins: data }, {}, function (err, str) {
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

app.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    console.log(' Name ' + name + ' email :' + email + ' pass:' + password, 'up to here works!');
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }
    //check if match
    if (password !== password2) {
        console.log('different passwords')
        errors.push({ msg: "passwords dont match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        console.log('small passworrds')
        errors.push({ msg: 'password at least 6 characters' })
    }
    if (errors.length > 0) {
        console.log('we got here')
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        //validation passed
        User.findOne({ email: email }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: 'email already registered' });
                res.render('register', { errors, name, email, password, password2 })
            } else {
                console.log('good')
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    console.log(value, 'it worked!')
                                    req.flash('success_msg', 'You have now registered!')
                                    res.redirect('/login');
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
});

app.post('/login',
    passport.authenticate('local', {
        successReturnToOrRedirect: '/managment',
        failureRedirect: '/login',
        failureMessage: true
    }),
);


app.get('/managment', loggedIn, async (req, res, next) => {
    const data = await coinHandler.findCoins();
    ejs.renderFile('./public/managment.ejs', { coins: data }, { user: req.user }, function (err, str) {
        console.error(err)
        res.send(str)
    });
});

app.get('/newcoin', loggedIn, async (req, res) => {
    try {
        const data = {}
        ejs.renderFile('./public/newcoin.ejs', data, {}, function (err, str) {
            res.send(str)
        });
    } catch (err) {
        console.error(err);
    };

})

app.get('/editcoin/(:id)', loggedIn, function (req, res, next) {

    coinsModel.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("editcoin", {
                title: "Update A coin!",
                data: doc
            });
        } else {
            req.flash('error', 'Coin not found with id = ' + req.params.id)
            res.redirect('/managment')
        }
    });



})

app.get("/coins", async (request, response) => {
    const coins = await coinsModel.find({});

    try {
        response.send(coins);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post('/editcoin/:id', loggedIn, function (req, res) {
    const { Year, Denomination, Pic, History, Value } = req.body;
    console.log(' Year: ' + Year +
        'Denomination :' + Denomination +
        'Pic:' + Pic +
        'History' + History +
        'Value' + Value);
    const editcoin = req.body;
    coinsModel.findByIdAndUpdate(req.params.id, editcoin,
        function (err, result) {
            console.log(req.params.id)
            if (err) {
                req.flash('error!');
                res.render('/managment');
            } else {
                console.log('sucess')
                req.flash('updated');
                res.redirect('/managment');
            }
        });
});

app.post('/coins', loggedIn, (req, res) => {
    const { Year, Denomination, Pic, History, Value } = req.body;
    console.log(' Year: ' + Year +
        ' Denomination :' + Denomination +
        ' Pic:' + Pic +
        'History' + History +
        'Value' + Value);
    const newCoin = new coinsModel({
        Year: Year,
        Denominaiton: Denomination,
        Pic: Pic,
        History: History,
        Value: Value
    });
    newCoin.save()
        .then((value) => {
            req.flash('New coin saved!')
            res.redirect('/newcoin');
        })
});



app.delete("/coins/:id", loggedIn, async (request, response) => {
    try {
        const coins = await coinsModel.findByIdAndDelete(request.params.id);

        if (!coins) response.status(404).send("No item found");
        response.status(200).send();
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get('/register', async (req, res) => {

    const data = {}
    ejs.renderFile('./public/register.ejs', data, {}, function (err, str) {
        res.send(str)
    });
})

app.get('/logout', async (req, res) => {
    try {
        req.logout;
        req.flash('success_msg', 'Now logged out');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
    }

})

const PORT = process.env.PORT || process.env.PORT_ACESS;
console.log(PORT)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});   

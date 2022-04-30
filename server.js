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
        errors.push({ msg: 'password at least 6 characters' })
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
        //validation passed
        User.findOne({ email: email }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: 'email already registered' });
                res.render('register', { errors, name, email, password, password2 })
            } else {
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
                                    console.log(value)
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


app.get('/managment', loggedIn, async (req, res,next) => {
    const data = await coinHandler.findCoins();
    ejs.renderFile('./public/managment.ejs', { coins: data }, { user: req.user }, function (err, str) {
        console.error(err)
        res.send(str)
    });
});

app.get("/coins", async (request, response) => {
    const coins = await coinsModel.find({});
  
    try {
      response.send(coins);
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
  app.post("/coins", async (request, response) => {
      const coins = new coinsModel(request.body);
    
      try {
        await coins.save();
        response.send(coins);
      } catch (error) {
        response.status(500).send(error);
      }
    });
  
    app.patch("/coins/:id", async (request, response) => {
      try {
        await coinsModel.findByIdAndUpdate(request.params.id, request.body);
        await coinsModel.save();
        response.send(coin);
      } catch (error) {
        response.status(500).send(error);
      }
    });
  
    app.delete("/coins/:id", async (request, response) => {
      try {
        const coins = await coinsModel.findByIdAndDelete(request.params.id);
    
        if (!coins) response.status(404).send("No item found");
        response.status(200).send();
      } catch (error) {
        response.status(500).send(error);
      }
    });
  
    app.get('/coins/:id', (req, res) => {
      Coins.find({}, function(err, coins) {
          res.render('index.html', {
              CoinsList: coins
          })
      })
  })

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
        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
    }

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});   

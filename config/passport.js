const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/user.model.js")


module.exports = {
    loggedIn: function (req, res, next) {
        console.log(req);
        if (req.session.passport.user) {
            next();
        } else {
            res.redirect('/login');
        }
    },
    passport: function (passport) {
        passport.use(
            new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
                function (email, password, done) {
                    //match user
                    User.findOne({ email: email },
                        function (err, user) {
                            if (err !== null) { console.log(err); return; }
                            if (!user) {
                                return done(null, false, { message: 'that email is not registered' });
                            }
                            //match pass
                            bcrypt.compare(password, user.password, (err, isMatch) => {
                                if (err) throw err;

                                if (isMatch) {
                                    return done(null, user);
                                } else {
                                    return done(null, false, { message: 'pass incorrect' });
                                }
                            })
                        })
                })

        )
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });
    }
}; 
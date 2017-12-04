var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
// register
router.get('/register', function (req, res) {
    res.render('register');
});
// get login
router.get('/login', function (req, res) {
    res.render('login');
});
//register users
router.post('/register', function (req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    req.checkBody('name', "Name is required").notEmpty();
    req.checkBody('username', "Username is required").notEmpty();
    req.checkBody('email', "Email is required").notEmpty();
    req.checkBody('email', "Email is not valid").isEmail();
    req.checkBody('password1', "Password is required").notEmpty();
    req.checkBody('password2', "Password confirmation is required").notEmpty();
    req.checkBody('password2', "Passwords must match").equals(password1);
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });
    }
    else {
        User.getUserByUsername(username, function (err, user1) {
            User.getUserByEmail(email, function (err, user2) {
                if (user1 != null) {
                    console.log("Username is taken");
                    req.flash("error_msg", "Username is taken");
                    res.render('register', {
                        errors: [{ "msg": "Username is taken" }]
                    });
                }
                else if (user2 != null) {
                    console.log("Email is already in use");
                    req.flash("error_msg", "Email is already in use, try signing in, or registering with a different email address.");
                    res.render('register', {
                        errors: [{ "msg": "Email is already in use, try signing in, or registering with a different email address." }]
                    });
                }
                else {
                    console.log("Success");
                    var newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password1
                    });
                    User.createUser(newUser, function (err, newUser) {
                        if (err) {
                            throw err;
                        }
                        console.log(newUser);
                    });
                    req.flash("success_msg", "you are registered and can now log in");
                    res.redirect('/users/login');
                }
            });
        });
    }
});
passport.use(new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err)
                throw err;
            if (isMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Incorrect username or password" });
            }
        });
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.getUserByID(id, function (err, user) {
        done(err, user);
    });
});
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), function (req, res) {
    req.flash("success_msg", "You are logged in");
    res.redirect("/");
});
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});
module.exports = router;

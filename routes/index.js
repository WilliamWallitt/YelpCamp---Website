var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get('/', function(req, res){
    res.render('landing');
});


// ===============
// Auth routes
// ===============

// show register form 
router.get('/register', function(req, res) {
    res.render('register');
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        // so if user name taken - throw err, render register page
        if(err){
            req.flash('error', err.message);
            return res.redirect("register");
        }
        // otherwise use local auth method to verify user
        // then redirect to campgrounds
        passport.authenticate("local")(req, res, function(){
            req.flash('success', "Welcome to YelpCamp: " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get('/login', function(req, res) {
   res.render('login');
});

// login logic - middleware, check if user has account, then redirect
// we are authenticating first - before we do anything else
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res) {
    
});

// logout logic
router.get('/logout', function(req, res) {
   req.logout(); 
   req.flash('success', 'Logged you out!');
   res.redirect('/campgrounds');
});



module.exports = router;
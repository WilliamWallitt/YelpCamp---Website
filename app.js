var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require('connect-flash'),
    passport    = require('passport'),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require('./models/user'),
    seedDB      = require("./seeds");
    
// include comment routes
var commentRoutes      = require('./routes/comments'),
    campgroundRoutes   = require('./routes/campgrounds'),
    indexRoutes        = require("./routes/index");

// create yelp_camp db + connect
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//everytime we run, seed database
seedDB();

// PASSPORT CONFIG
// ================
app.use(require("express-session")({
    secret: "encoding the shit out the password",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// User.auth comes from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =================
// so we dont have to pass req.user to all pages
// add flash to all pages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// requiring routes
app.use(indexRoutes);
// first arg avoids repetition in the routes
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('The YelpCamp Server Has Started!');
});

//db.collection.drop() - removes all objects in collection

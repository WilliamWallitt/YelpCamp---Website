var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get('/', function(req, res){
    // get all campgrounds from db
    campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            // pass in all campgrounds - to campgrounds.ejs
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }
    });
});

// make new campground - restful routing
// CREATE - add new campground to db
router.post('/',middleware.isLoggedIn, function(req, res){
    // get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        username: req.user.username,
        id: req.user._id
    };
    var price = req.body.price;
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author,
        price: price
    };
    
    // create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log('Error');
        } else {
            req.flash('success', "Campground created");
            res.redirect('/campgrounds');
        }
    });
});

// NEW -show form to create new campground
// show form to send data to app.post('/campgrounds')
router.get('/new', middleware.isLoggedIn,  function(req, res) {
     res.render('campgrounds/new');
});

// SHOW - show info about one campground
router.get('/:id', function(req, res) {
    // find by ID
    campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });

});

// EDIT CAMPGROUND ROUTE

router.get('/:id/edit',middleware.checkCampgroundOwnership, function(req, res) {
    campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', "Campground edited");
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE

router.put('/:id',middleware.checkCampgroundOwnership, function(req, res) {
    // find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
   campground.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect('/campgrounds');
       } else {
           req.flash('success', "Campground deleted");
           res.redirect('/campgrounds');
       }
   });
});


// req.user._id = string, author.id = mongoose object
// so use .equals(id)


// export router
module.exports = router;

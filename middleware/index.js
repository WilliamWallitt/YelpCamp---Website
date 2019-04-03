var campground = require("../models/campground");
var comment = require("../models/comment");
// all middleware goes here
var middlewareObj = {

};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    
    if(req.isAuthenticated()) {
        // find campground
        campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                // check if user is the author
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }

};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    
    if(req.isAuthenticated()) {
    // find campground
    comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash('error', "Comment not found");
            res.redirect('back');
        } else {
            // check if user is the author
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', "You don't have permission to do that");
                res.redirect('back');
            }
        }
    });
        
    } else {
        req.flash('error', "You need to be logged in to do that");
        res.redirect('back');
    }
    
};


middlewareObj.isLoggedIn = function(req, res, next) {
    
    // middleware
    // check if user is logged in
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');

};


// export it
module.exports = middlewareObj;
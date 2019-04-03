var express = require("express");
// merge params of campgrounds and comment together - so we can access both of them
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});

// Comments create
router.post('/',middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   campground.findById(req.params.id, function(err, campground){
       if(err){
           req.flash('error', "Cant find Campground");
           res.redirect("/campgrounds");
       } else {
        //create new comment
        comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash('error', "Something went wrong - Comment not created");
           } else {
               // add username and id to comments
               comment.author.username = req.user.username;
               comment.author.id = req.user._id;
               //connect new comment to campground
               campground.comments.push(comment);
               comment.save();
               campground.save();
               //redirect campground show page
               req.flash('success', "Successfully added comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// EDIT COMMENT ROUTE
router.get('/:comment_id/edit',middleware.checkCommentOwnership, function(req, res){
    comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash('error', "Something went wrong - Can't find comment");
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE COMMENT
router.put('/:comment_id',middleware.checkCommentOwnership, function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', "Comment updated");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DELETE COMMENT
router.delete('/:comment_id',middleware.checkCommentOwnership, function(req, res){
    comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});


module.exports = router;
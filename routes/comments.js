var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW - /campgrounds/:id/comments/new
//Adding the isLoggedIn middleware so as to log in the user before adding comments
router.get("/new",middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			console.log("campground");
			res.render("comments/new", {campground: campground});
		}
	})
});

//CREATE - /campgrounds/:id/comments
router.post("/",middleware.isLoggedIn, function(req, res){
	
	//Get the comments body from the form
	var data = req.body.comments;
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
	if(err){
		console.log(err);
		res.redirect("/campgrounds");
	}else{
		//create new comment
		Comment.create(data, function(err, comment){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
		}else{
			//add username and id to comment
			comment.author.id = req.user._id;
			comment.author.username = req.user.username;
			//save comment
			comment.save();
			//connect new comment to campground
			campground.comments.push(comment);
			campground.save();
			//Redirect campground show page	
			req.flash("success", "Successfully added comment");
			res.redirect("/campgrounds/" + campground._id);
		}
		});
	}
	});
});

//EDIT ROUTE - /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
		// req.params.id is already the campground id from the URL
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});	
			}
		});	
	});
});

//UPDATE ROUTE - /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			//Redirect to SHOW Page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE - /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}		   
	});
})


//Middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//Middleware to check authorization
function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				//does user own the campground?
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				}else{
					console.log("YOU DO NOT HAVE PERMISSION TO DO THAT!!");
					res.redirect("back");
				}	
			}
		});
	}else{
		res.redirect("back");
	}
}


module.exports = router;

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Show all the camp grounds
//INDEX - show all campgrounds
router.get("/", function(req, res){
	//req.user contains all the data about current logged in user
	//Render all the campgrounds 
	//res.render("campgrounds", {campgrounds : campgrounds});
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add data to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	//Create a author object
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	//Create a new object
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//If the newly added campground was valid, then redirect to view page
			res.redirect("/campgrounds");
		}
	});
	//Push the new campground object to the Campground array
	// campgrounds.push(newCampground);
	//redirect back to campgrounds page (Redirects to GET /campgrounds)
	//res.redirect("/campgrounds");
});

//Form to create a new campground
//NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	//Find the campground with that provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		//if a DB error or no campground found by that ID
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		}else{
			console.log(foundCampground);
			//Render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});	


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//render the show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id/", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;

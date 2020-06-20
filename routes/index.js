var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//Landing Page
router.get("/", function(req, res){
	res.render("landing");
});

//Show register form
router.get("/register", function(req, res){
	res.render("register");
});

//Handle signup logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	//Register the user
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			//trying to add a user with an existing username
			req.flash("error", err.message);
			return res.render("register");
		}
		//if signed up, then login and redirect to /campgrounds
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
			res.redirect("/campgrounds");
		});
	});
});

//Show login form
router.get("/login", function(req, res){
	res.render("login");
});

//Handling login logic
router.post("/login", passport.authenticate("local",
	{
	   successRedirect: "/campgrounds",
	   failureRedirect: "/login"
	}),function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;
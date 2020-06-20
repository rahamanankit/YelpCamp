var express    	   = require("express"),
	app        	   = express(),
	bodyParser 	   = require("body-parser"),
	mongoose   	   = require("mongoose"),
	flash          = require("connect-flash"),
	passport   	   = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         = require("./seeds");

//Requiring Routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
//For seeding the DB (to remove all data and add some sample data at server start)
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Use the routes
app.use("/", indexRoutes);
//Append /campgrounds/:id/comments in front of all comment routes
app.use("/campgrounds/:id/comments", commentRoutes);
//Append /campgrounds in all routes
app.use("/campgrounds", campgroundRoutes);

//SCHEMA SETUP

//In models directory

app.listen(3000, process.env.IP, function(req, res){
	console.log("YelpCamp Server Has Started!");
});
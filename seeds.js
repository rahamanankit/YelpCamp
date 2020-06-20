var mongoose = require("mongoose");

//Require the Campground Model
var Campground = require("./models/campground");

//Require the Comment Model
var Comment = require("./models/comment");

//Defined an array of campgrounds
var data = [
	{
		name: "Cloud's Rest", 
		image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
	},
	{
		name: "Desert Mesa", 
		image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
	},
	{
		name: "Canyon Floor", 
		image: "https://images.unsplash.com/photo-1539183204366-63a0589187ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
	},	
];

function seedDB(){
	//Delete everything that is there in the DB at first
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("removed campgrounds");
			//Loop through the data array and add them in the DB
			data.forEach(function(seed){
			//Add a few campgrounds
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				}else{
					console.log("added a campground");
					//create a comment
					Comment.create(
					{
						text: "This place os great, but I wish there was internet",
						author: "Homer"
					}, function(err, comment){
						if(err){
							console.log(err);
						}else{
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment");
						}
					});
				}
			});	
		});	
		}
   });		
}

module.exports = seedDB;


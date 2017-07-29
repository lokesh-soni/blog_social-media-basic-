var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var multer = require('multer');
var flash = require('flash');
var fileUpload = require('express-fileupload');
var posts = require('../models/posts');
var categories = require('../models/categories');
var User = require('../models/user');
var db = mongoose.connection;

router.get('/show/:id', function(req, res, next) {
	posts.findById(req.params.id, function(err, post){
		res.render('show',{
			"post": post
		});
	});
});
router.get('/add',ensureAuthenticated, function(req, res, next) {
	categories.find({},{}, function(err, categories){
		console.log(categories);
		res.render('addpost',{
			"categories": categories
		});	
	});
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

router.get('/editprofile/:id', function(req, res, next) {
	User.findById(req.params.id, function(err,user){
		res.render('editprofile',{
			"user": user
		});	
	});
});
router.post('/editprofile', function(req, res, next) {
    // Get form values
	var uid    = req.body.uid;
	var comp        = req.body.comp;
	var position    = req.body.position;
	var institute   = req.body.institute;
	var insta       = req.body.insta;
	var twit        = req.body.twit;
	var fb          = req.body.fb;
	var linkedin    = req.body.linkedin;
	console.log(uid+','+comp+','+insta+','+fb);
	// Form validation

	User.update({
			"_id":uid
		},
		{
			"$set":{
							
				"comp" : comp,
				"position" : position,
				"institute" : institute,
				"insta" : insta,
				"twit" : twit,
				"fb" : fb,
				"linkedin" : linkedin
			}
		},
		function(err, doc) {
			if(err) {
				console.log(err);				
			} else {
				req.flash('success', 'Profile edited');
				res.location('/');
				res.redirect('/');
			}
		}
	);
	
});

router.post('/add', function(req, res){
	//Get form Values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author_name = req.body.author_name;
	var author_username = req.body.author_username;
	var date = new Date();
	if(req.files.mainimage){
		var mainImageOriginalName = req.files.originalname;
		var mainImageName = req.files.mainimage.name;
		var mainImageMime = req.files.mainimage.mimetype;
		var mainImagePath = req.files.mainimage.path;
		var mainImageExt = req.files.mainimage.extension;
		var mainImageSize = req.files.mainimage.size;
	}
		else {
			var mainImageName = null;
		}
	// Form Validation
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('body', 'Body is required');
	// Check Errors
	var errors = req.validationErrors();
	if(errors){
		res.render('addpost',{
			"errors": errors,
			"title":title,
			"body": body
		});
	} else {
		//submit
		var posts = db.collection('posts');
		
		//submit
		posts.insert({
			//"post_id": post_id,
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author_name": author_name,
			"author_username": author_username,
			"mainimage": mainImageName
		}, function(err, post){
			if(err){
				res.send('Errors ho gaiiiillll ba re');
			}
			else {
				req.flash('success', 'Post submitted');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

router.post('/addcomment', function(req, res, next) {
    // Get form values
	var name 		= req.body.name;
	var body        = req.body.body;
	var postid      = req.body.postid;
	var commentdate = new Date();
	console.log('postid:'+postid+'Comment:'+body);
	// Form validation

	var comment = {
		"name": name,
		"body": body,
		"commentdate": commentdate
	};
	console.log(comment.name);
	posts.update({
			"_id": postid
		},
		{
			"$push":{
				"comments":  {
					"name": name,
					"body": body,
					"commentdate": commentdate
				}
			}
		},
		function(err, doc) {
			if(err) {
				console.log(err);				
			} else {
				req.flash('success', 'Comment added');
				res.location('/posts/show/' + postid);
				res.redirect('/posts/show/' + postid);
			}
		}
	);
	
});

module.exports = router;
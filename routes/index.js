var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var posts = require('../models/posts');
var CommentsSchema = require('../models/CommentsSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
	posts.find({}, {}, function(err, posts){
		res.render('index',{
			"posts": posts,
		});		
	});
});
router.get('/:author_username', function(req, res, next) {
	console.log(req.params.author_username);
	posts.find({author_username:req.params.author_username},{}, function(err, posts){
		//console.log(post);
		res.render('index',{
			"posts": posts
		});
	});
});

module.exports = router;

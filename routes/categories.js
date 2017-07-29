/**
 * Created by aprovis on 08/05/2015.
 */

var express = require('express');
var router = express.Router();
var flash = require('flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeBlog');
var db = mongoose.connection;

router.get('/show/:category', function(req, res, next) {
    var db = req.db;
    var posts = db.collection('posts');
    posts.find({category: req.params.category}, {}, function(err, posts) {
        res.render('index', {
            "title": req.params.category,
            "posts": posts
        });
    });
});

router.get('/add', function(req, res, next) {
    res.render('addcategory', {
        "title": "Add Category"
    })
});

router.post('/add', function(req, res, next) {
    // Get form values
    var title       = req.body.title;

    // Form validation
    req.checkBody('title', 'Title field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('addcategory', {
            errors: errors,
            "title": title
        });
    } else {
        var categories = db.collection('categories');

        // Submit to database
        categories.insert({
            "title": title
        }, function(err, category) {
            if (err) {
                res.send('There was an issue submitting the category');
            } else {
                req.flash('success', 'Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;

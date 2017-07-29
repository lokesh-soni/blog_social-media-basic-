var mongoose = require('mongoose');
var CommentsSchema = require('../models/CommentsSchema');
var Schema = mongoose.Schema;


var lists = new Schema({
	title:{
		type: String,
		required: true
	},
	author_username:{
		type: String
	},
	author_name: {
		type: String
	},
	category:{
		type: String
	},
	body:{
		type: String,
		required: true
	},
	//comments: [CommentsSchema],
	comments: [{
		name:{
			type: String,
		},

		body:{
			type: String,
		},
		username: {
			type: String
		},
		//cmnt: [CommentsSchema],
		commentdate :{
			type: Date,
			default: Date.now
		}
	}],
	date:{
		type: Date,
		default: Date.now
	}
});

var posts = module.exports = mongoose.model('posts', lists);

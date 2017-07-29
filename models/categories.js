var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var lists = new Schema({
	title:{
		type: String,
		required: true
	}
});

var categories = module.exports = mongoose.model('categories', lists);

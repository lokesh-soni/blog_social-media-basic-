var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var commentSchema = new Schema({
	
	name:{
		type: String,
	},
	body:{
		type: String,
	},
	comment_like: {
		type: Number
	},
	commentdate :{
		type: Date,
		default: Date.now
	}
	
});

var cmnt = module.exports = mongoose.model('cmnt', commentSchema);

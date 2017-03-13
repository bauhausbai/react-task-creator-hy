var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	id: String,
	username: String,
	password: String,
	email: String,
	imgurl: String,
	time: Date,
	mobile: [{
		taskid: String,
		thumbnail: String,
		url: String
	}],
	pc: [{
		taskid: String,
		thumbnail: String,
		url: String
	}],
	unfinished: [{
		taskid: String,
		thumbnail: String,
		url: String
	}]
});

module.exports = UserSchema;


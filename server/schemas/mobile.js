var mongoose = require("mongoose");

var MobileSchema = new mongoose.Schema({
	docname: String,
	creatorId: String,
	status: Number,
	type: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	},
	pages: [{
		pagination: Number,
		eles: [{
			eleid: Number,
			eletype: String,
			width: String,
			height: String,
			top: String,
			left: String,
			animate: {
				name: String,
				duration: Number,
				delay: String,
				times: String
			},
			url: String,
			linkTo: Number
		}]
	}],
	images: []
});

module.exports = MobileSchema;


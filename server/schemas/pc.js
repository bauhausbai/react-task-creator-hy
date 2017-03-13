var mongoose = require("mongoose");

var PCSchema = new mongoose.Schema({
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
	blocks: [{
		pagination: Number,
		eles: [{
			eleid: Number,
			eletype: String,
			width: String,
			height: String,
			top: String,
			left: String,
			imgs: [],
			url: String,
			linkTo: String
		}]
	}],
	images: []
});

module.exports = PCSchema;


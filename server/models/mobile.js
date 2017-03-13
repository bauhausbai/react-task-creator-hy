var mongoose = require('mongoose');
var MobileSchema = require('../schemas/mobile.js')
var Mobile = mongoose.model('Mobile', MobileSchema);

module.exports = Mobile;
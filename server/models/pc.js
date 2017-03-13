var mongoose = require('mongoose');
var PCSchema = require('../schemas/pc.js')
var Pc = mongoose.model('PC', PCSchema);

module.exports = Pc;
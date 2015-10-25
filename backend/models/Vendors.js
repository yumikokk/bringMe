var mongoose = require('mongoose');

var VendorSchema = new mongoose.Schema({
	name: String,
	created_at: { type: Date, default: Date.now }
});


mongoose.model('Vendor', VendorSchema);
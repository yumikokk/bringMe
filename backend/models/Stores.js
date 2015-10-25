var mongoose = require('mongoose');

var StoreSchema = new mongoose.Schema({
	vendor: {type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
	street_address: String,
	city: {type: mongoose.Schema.Types.ObjectId, ref: 'City' },
	zip_code: String,
	state: String,
	store_name: String,
	lat: Number,
	lng: Number,
	place_id: String,
	formatted_address: String,
	created_at: { type: Date, default: Date.now }
});


mongoose.model('Store', StoreSchema);
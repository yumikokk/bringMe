var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
	// status means Order is complete or not
	// -1 means voided/expired
	// 0 means on the way
	// 1 means fulfilled by bringer_id
	status: { type: Number, default: 0 },
	created_at: { type: Date, default: Date.now },
	request_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Request'},
	tax: Number,
	total_amount: Number
});

mongoose.model('Order', OrderSchema);
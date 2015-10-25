var mongoose = require('mongoose');

var GoingSchema = new mongoose.Schema({
	bringer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
	bringme_orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bringmeorder' }],
	deadline: Date
});

mongoose.model('Going', GoingSchema);
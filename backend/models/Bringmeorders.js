var mongoose = require('mongoose');

var BringmeorderSchema = new mongoose.Schema({
	going_obj: { type: mongoose.Schema.Types.ObjectId, ref: 'Going' },
	store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
	bringme_orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bringmeorder' }],
	deadline: Date
});

mongoose.model('Bringmeorder', BringmeorderSchema);
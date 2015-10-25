var mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
	name: String,
	zipcode: String,
	state: String
});

mongoose.model('City', CitySchema);
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var GoogleLocations = require('google-locations');
var geocoder = require('geocoder');
var locations = new GoogleLocations('AIzaSyDL_zzw8rQCu9TXjJH3bwKXB5B5dYve6nc');
var http = require('http');
var request = require('request');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var passport = require('passport');
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Vendor = mongoose.model('Vendor');
var City = mongoose.model('City');
var Product = mongoose.model('Product');
var Request = mongoose.model('Request');
var Order = mongoose.model('Order');
var Store = mongoose.model('Store');


router.post('/venmo_access', function(req, res, next) {
	request.post('https://api.venmo.com/v1/oauth/access_token',
		{ form: req.body.url_string},
		function(error, response, body) {
			res.json(body);
		});
	
});

router.post('/makePayments', function(req, res, next) {
	request.post('https://api.venmo.com/v1/payments', 
		{ form: req.body.paymentDetails}, 
		function(error, response, body) {
			res.json(body);
		});
});


router.get('/posts', function(req, res, next) {
	
	Post.find(function(err, posts) {
		if (err) { next(err); }

		res.json(posts);
	})
});

router.post('/posts', auth, function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;

	post.save(function(err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});

router.param('post', function(req, res, next, id) {
	var query = Post.findById(id);

	query.exec(function (err, post) {
		if (err) { return next(err); }
		if (!post) { return next(new Error("can't find the post")); }
		
		req.post = post;
		return next();
	})
});

router.get('/posts/:post', function(req, res) {
	res.json(req.post);
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment) {
		if(err) { return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if (err) {return next(err); }

			res.json(comment);
		});
	});
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
	req.comment.upvote(function(err, comment) {
		if (err) { return next(err); }

		res.json(comment);
	});
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);
  user.prefer_role = parseFloat(req.body.prefer_role);

  console.log(user);

  user.save(function (err){
    if(err){ return next(err); }
    return res.json({token: user.generateJWT(), prefer_role: user.prefer_role });
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT(), prefer_role: user.prefer_role });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* List cities that we are currently supporting */
router.get('/cities', function(req, res, next) {
	City.find(function(err, cities) {
		if (err) { next(err); }

		res.json(cities);
	})
});

/* BringMe Make a request */
router.post('/make-a-request', auth, function(req, res, next) {
	var request = new Request();
	request.meet_location = req.body.meet_location;
	request.tips = req.body.tips;
	request.bringme = req.payload._id;
	request.vendor = req.body.vendor;
	request.products = req.body.products;
	
	request.save(function(err, request) {
		if (err) { return next(err); }

		res.json(request);
	});

});

router.get('/vendors/:vendor_name', function(req, res, next) {
	var vendor_name = req.params.vendor_name;
	vendor_name = decodeURI(vendor_name);

	Vendor.findOne({ 'name': 'Trader Joe\'s' }, function (err, vendor) {
	  if (err) return next(err);
	  console.log(vendor);
	  res.json(vendor);
	});
});

router.get('/vendors/:vendor_name/products', function(req, res, next) {
	var vendor_name = req.params.vendor_name;
	vendor_name = decodeURI(vendor_name);
	Vendor.findOne({ 'name': vendor_name }, function (err, vendor) {
	  if (err) return next(err);
	  Product.find({ 'vendor': vendor }, function(err, products) {
	  	res.json(products);
	  })
	});
});

// BringEr APIs

router.get('/lookfor_nearby/:vendor_name/:lat/:lng', function(req, res, next) {
	locations.search({ name: req.params.vendor_name, radius:'10000', location: [req.params.lat, req.params.lng]}, function(err, response) {
	  console.log("search: ", response.results);
	  console.log("geo", response.results[0].geometry.location);
	  // locations.details({placeid: response.results[0].place_id}, function(err, response) {
	  //   console.log("search details: ", response.result.website);
	  // });
	});
});

router.get('/open_requests', function(req, res, next) {
	var yesterday = Date.now() - 24*60*60;
	Request.find({'created_at': { $lt: new Date(yesterday) }, 'request_status': 0}, function(err, requests){
		res.json(requests);
	});
});

/*
*  Below APIs are for BringMe's admins
*  
*  TODO: create admin database
*
*/

router.post('/city', function(req, res, next){
	var city = new City(req.body);

	city.save(function(err, city) {
		if (err) { return next(err); }
		res.json(city);
	});
});

// router.param('vendor', function(req, res, next, id) {
// 	var query = Vendor.findOneById(id);

// 	query.exec(function (err, vendor) {
// 		if (err) { return next(err); }
// 		if (!vendor) { return next(new Error("can't find the vendor")); }
		
// 		req.vendor = vendor;
// 		return next();
// 	})
// });

router.post('/vendors', function(req, res, next){
	var vendor = new Vendor();
	vendor.name = req.body.name;

	// Save the vendor instance
	vendor.save(function(err, vendor) {
		if (err) { return next(err); }
		res.json(vendor);
	});

	// Find City's id based on city's name
	// City.findOne({name:req.body.city}, function(err, city) {
	// 	if (err) return next(err);
	// 	vendor.city = city;
	// });
	
});

router.post('/vendors/:vendor_id/products', function(req, res, next){
	var product = new Product(req.body);

	console.log(product);

	product.save(function(err, product) {
		if (err) { return next(err); }
		res.json(product);
	});
	
});

router.post('/stores', function(req, res, next) {
	var store = new Store(req.body);
	//Find City's id based on city's name
	var complete_street = store.street_address + ", " + req.body.city + ", " + store.state;
	console.log(complete_street);

	geocoder.geocode(complete_street, function ( err, data ) {
	  var store_geo = data.results[0];
	  store.formatted_address = store_geo.formatted_address;
	  store.place_id = store_geo.place_id;
	  store.lat = parseFloat(store_geo.geometry.location.lat);
	  store.lng = parseFloat(store_geo.geometry.location.lng);
	});
	City.findOne({name:req.body.city}, function(err, city) {
		if (err) return next(err);
		store.city = city;
	});
	Vendor.findOne({name:req.body.vendor}, function(err, vendor) {
		if (err) return next(err);
		store.vendor = vendor;
		store.save(function(err, store) {
			if (err) { return next(err); }
			console.log(store);
			res.json(store);
		});
	});
})



module.exports = router;

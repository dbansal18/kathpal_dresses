var express = require('express');
var router = express.Router();
const Category = require('./../models/category-model');
const Product = require('./../models/product-model');

/* GET home page. */
router.get('/', function(req, res, next) {
	Category.find({}, (err, category) => {
		if (err) throw (err);
		if (category) {
			res.render('index', { category: category, user: req.user });
		}
	})
});

router.get('/category/:name', function(req, res, next) {
	console.log(req.params.name);
	Product.find({category: {"name": req.params.name}}, (err, products) => {
		if (err) throw (err);
		if (products) {
			// res.send(products)
			res.render('shop', {products: products, user: req.user});
		}
	})
});

module.exports = router;

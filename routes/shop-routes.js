const router = require('express').Router();

const Product = require('./../models/product-model');

router.get('/', (req, res, next) => {
    Product.find({}, (err, products) => {
                if (err) return next(err)
                    res.render('shop', {products: products, user: req.user}); 
            })
})

router.get('/product/:id', (req, res) => {
			// console.log('id is ',req.params);
	Product.findOne({_id: req.params.id}, function (err, product) {

        if (err) {
        	console.log('product does not exit');
        	res.redirect('/shop');
        	// throw (err);
		} if (product) {
            res.render('product', {product: product, user: req.user});
        }
	});
})

module.exports = router;
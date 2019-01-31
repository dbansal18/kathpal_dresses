var express = require('express');
var router = express.Router();
const Product = require('./../../models/product-model');
const Rent = require('./../../models/rent-model');

var date = require('./../date');

const authCheck = (req, res, next) => {
    if(!req.user){
    	error = {
            status: '404',
            stack: 'Requsted Page Unavalible'
        };
        res.render('error', {message:'Permission Denied', error});
        // res.redirect('/auth/login');
    } else {
        next();
    }
};

/* GET home page. */
router.get('/', authCheck, function(req, res, next) {
	if(req.query.quantity < 1 || (req.query.mindate > req.query.maxdate)) {
		res.send({status: 0})
	} else {
		console.log('aagya');
		d = date.main(req.query.mindate, req.query.maxdate);
		// console.log('date', d);
		Product.findOne({_id: req.query.id}, function (err, product) {
			if (err) {
	        	console.log('product does not exit');
	        	res.send({status: 0});
	        	// throw (err);
			} if (product) {
	            var total = product.productRentPrice * req.query.quantity * d;
	            new Rent({
	            	productName: product.productName,
				    productRentPrice: product.productRentPrice,
				    rentQuantity: req.query.quantity,
				    category: product.category,
				    productID: product._id,
				    rentTotal: total,
				    startDate: req.query.mindate,
				    endDate: req.query.maxdate,
				    totalDays: d,
				    user: {
				    	id: req.user._id,
				    	name: req.user.name,
				    	username: req.user.username
				    },
				    status: 0
	            }).save().then((newRent) => {
	            	console.log(newRent);
	            })
	            res.send({status: 1, total: total});
	        }
		});
	}
});

module.exports = router;
var express = require('express');
var router = express.Router();
const Product = require('./../../models/product-model');
const Rent = require('./../../models/rent-model');

const authCheck = (req, res, next) => {
    if(!req.user || req.user.role !== 'admin'){
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
	Rent.find({}, function (err, rent) {
		// console.log(rent);
		res.render('./admin/rentRequest', {user: req.user, rent: rent})
	})
});

module.exports = router;

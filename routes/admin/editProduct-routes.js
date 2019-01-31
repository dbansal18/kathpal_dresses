var express = require('express');
var app=express();
var router = require('express').Router();
const Product = require('../../models/product-model');

var bodyParser = require('body-parser');
var path =require('path');
var ejs= require('ejs');
app.set('views', __dirname+'../views');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine' , 'ejs');
app.use(express.static('/views'));

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

router.get('/:id', authCheck, (req,res)=>{
	//console.log(req.body);
    Product.findOne({_id : req.params.id}, function (err, product) {
		if (err) throw err;
	    if (product) {
	  	 		res.render('admin/editProduct',{product: product, user: req.user});
	   	    }
	});
});

router.post('/:id',  authCheck, urlencodedParser ,(req,res)=>{
	Product.findOne({_id : req.params.id}, function (err, prod) {
		if (err) throw err;
	    if (prod) {
	  	 		prod.productName= req.body.productName;
                prod.productDescription= req.body.productDescription;
                prod.productPrice= req.body.productPrice;
                prod.productRentPrice= req.body.productRentPrice;
                prod.productQuantity= req.body.productQuantity;
	   	    }
	   	    prod.save((err,updatedProd)=>{
	   	    	if(err) throw err;
	   	    	console.log('Updated');
	   	    });
	   	    var url = "/shop/product/" + req.params.id ;
	   	    res.redirect(url);
	});
});

module.exports = router;
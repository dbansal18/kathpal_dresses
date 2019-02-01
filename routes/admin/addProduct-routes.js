var express = require('express');
var app=express();
var router = require('express').Router();
const Product = require('../../models/product-model');
const Category = require('../../models/category-model');

var multer=require('multer');
var path =require('path');
var ejs= require('ejs');

var bodyParser = require('body-parser');
app.set('views', __dirname+'../views');
app.set('view engine' , 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('/views'));

var thumbnailPath = [];
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/products')
    },
    filename: function (req, file, cb) {
    	var abc = Date.now();
    	var imgname='myImage-'+abc+path.extname(file.originalname);
    	thumbnailPath.push(imgname);
    	 		cb(null, file.fieldname + '-' +abc + path.extname(file.originalname));
    }
})
var upload = multer({ storage: storage, limits: { fileSize: 100000000 } });

app.set('view engine', 'ejs');

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
//app.use(express.static(__dirname + 'public/uploads'));
router.get('/', function (req, res) {
    if(req.user.role=='admin'){
        res.render('./admin/addProduct', {user: req.user});
    }else{
        error = {
            status: '404',
            stack: 'Requsted Page Unavalible'
        };
        res.render('error', {message:'Permission Denied', error});
    }
    
});

router.post('/', authCheck, urlencodedParser ,upload.array('myImage') , function (req, res) {
	console.log(req.body);
	if(!req.body.productName) {
        console.log('1');
		res.redirect('/');
	}
	else {
		 var name = req.body.productName;
         Product.findOne({productName: name}, function (err, prod) {

            if (err) throw (err);
            if (prod) {
                console.log("**");
                console.log("product already exists");
                res.redirect('/admin/add-product');
            } 
            else {
                    new Product().save().then((product) => {
                        product.productName = req.body.productName;
                        product.productDescription = req.body.productDescription;
                        product.category.name = req.body.category;
                        product.category.id = '';
                        Category.findOne({name: product.category.name}, function (err, category) {
                            if (err) throw (err);
                            if (category) {
                                // product.category.id = category._id;
                                // var length = category.product.length;
                                var products = {
                                        name: product.productName,
                                        id: product._id
                                    }
                                category.product.push(products);
                                category.save((err, update) => {
                                    if (err) throw err;
                                })
                                // category.product[length].id = product._id;
                                // category.product[length].name = product.name;
                            } else {
                                new Category({
                                    name: product.category.name,
                                }).save().then((newCategory) => {
                                    // product.category.id = newCategory._id;
                                    // newCategory.product[0].id = product._id,
                                    // newCategory.product[0].name = product.name
                                    var products = {
                                        name: product.productName,
                                        id: product._id
                                    }
                                    newCategory.product.push(products);
                                    newCategory.save((err, update) => {
                                        if (err) throw err;
                                    })
                                })
                            }
                        })
                        product.productPrice = req.body.productPrice;
                        product.productRentPrice = req.body.productRentPrice;
                        product.productQuantity = req.body.productQuantity;
                        product.thumbnail = thumbnailPath;
                        product.save((err,newProduct)=>
                        {
                            console.log('product created :',newProduct.productName ); 
                            var l=thumbnailPath.length;
                            for(var i=0;i<l;i++){
                               thumbnailPath.pop();
                            }
                            res.redirect('/');
                        })
                            
                    });
                    
                

            } 
        });
	}
});

module.exports = router;
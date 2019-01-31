const router = require('express').Router();
const User = require('../../models/user-model');
var express = require('express');
var app = express();

var multer=require('multer');
var path =require('path');
var ejs= require('ejs');
var bodyParser = require('body-parser');

app.set('views', __dirname+'../views');
app.set('view engine' , 'ejs');

app.use(express.static('/views'));

var thumbnailPath;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        var abc = Date.now();
        var imgname='myImage-'+abc+path.extname(file.originalname);
        thumbnailPath=imgname;
        cb(null, file.fieldname + '-' +abc + path.extname(file.originalname));
    }
})
var upload = multer({ storage: storage, limits: { fileSize: 100000000 } });

var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/', (req, res) => {
    res.render('./user/register', {user: req.user});
});

router.post('/',urlencodedParser, upload.single('myImage'), (req, res)=> {
	if(!req.body.username || !req.body.password) {
        console.log('1');
		res.redirect('/register')
	} else {
		 var name = req.body.username;
         User.findOne({username: name}, function (err, user) {
            if (err) throw (err);
            // console.log("**");
            if (user) {
                console.log("**");
                console.log("user already exists");
                res.render('index',{user:null});
                //console.log("user already exists");
            } 
            else {
                //console.log(path);
                // if not, create user in our db
                new User({
                    username: req.body.username,
                    name: req.body.name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    password: req.body.password,
                    thumbnail: thumbnailPath,
                    role: 'user',
                    loginType: 'Local Strategy'
                }).save();
                console.log('user created :',req.body.name );
                res.redirect('/');
            }
        });
	}
});

module.exports = router;
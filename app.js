var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	nodemailer	= require("nodemailer"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
	passportLocal=require("passport-local-mongoose"),
    flash        = require("connect-flash"),
	Note		= require("./models/notes"),
    User        = require("./models/user"),
    session = require("cookie-session"),
    methodOverride = require("method-override"),
	async		   = require("async"),
	crypto		   = require("crypto");



mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://vedant:Einstine@7@sshell-1-1wtzp.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true}).then(()=>{
	console.log("connected to db");
}).catch(err=>{
	console.log('ERROR:',err.message);
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("cookie-session")({
    secret:"Sshel  is great!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

//dashboard


app.get("/",function(req,res){
	res.render("landing");
})
app.get("/home",function(req,res){
	res.render("index");
	console.log("home page");
})


// app.get("/login",function(req,res){
// 	res.render("login")
// })

// app.post("/login",passport.authenticate("local", 
//     {
//         successRedirect: "/home",
//         failureRedirect: "/login",
//         failureFlash: true,
//         successFlash: 'Welcome to SSHELL!'
//     }), function(req, res){
// });

// app.get('/logout', function(req, res){
//   req.logout();
//   req.flash("success","Logged you out!")
//   res.redirect('/');
// });


// app.get("/register",function(req,res){
// 	res.render("register")
// })

// app.post("/register", function(req, res){
// 	var newUser=new User({
// 			username: req.body.username,
// 			firstName:req.body.firstName,
// 			lastName:req.body.lastName,
// 			email:req.body.email,
// 		})
// 	if(req.body.adminCode === "Einstine@7"){
// 		newUser.isAdmin = true;
// 	}
	
//     User.register(newUser, req.body.password, function(err, user){
//         if(err){
//            req.flash("error",err.message)
//     	   return res.render("register", {error: err.message});	
//         }
//          passport.authenticate("local")(req, res, function(){
// 		   req.flash("success","Welcome to SSHELL " + user.username)
//            res.redirect("/home")
//         });
//     });
// });

//contact

app.get("/contact",function(req,res){
	res.render("contact");
})

app.get("/features",function(req,res){
	res.render("features")
})

//notes
// app.get("/notes",function(req,res){
// 	res.render("notes")
// })
// app.get("/notes", function(req, res) {
//       res.render("notes");
// });

//user profile

// app.get("/users/:id",function(req,res){
// 	User.findById(req.params.id,function(err,foundUser){
// 		if(err){
// 			req.flash("error","Something went wrong!");
// 			res.redirect("/home")
// 		}
// 		res.render("profile",{user:foundUser})
// 	})
// })


app.get("/team",function(req,res){
	res.render("team");
})

//forgot password
// app.get("/forgot",function(req,res){
// 	res.render("forgot");
// })

// app.post('/forgot', function(req, res, next) {
//   async.waterfall([
//     function(done) {
//       crypto.randomBytes(20, function(err, buf) {
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function(token, done) {
//       User.findOne({ email: req.body.email }, function(err, user) {
//         if (!user) {
//           req.flash('error', 'No account with that email address exists.');
//           return res.redirect('/forgot');
//         }

//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//         user.save(function(err) {
//           done(err, token, user);
//         });
//       });
//     },
//     function(token, user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail', 
//         auth: {
//           user: 'karlevedant7@gmail.com',
//           pass:	'Einstine@7'
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'karlevedant7@gmail.com',
//         subject: 'Node.js Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         console.log('mail sent');
//         res.redirect("/confirmation");
//         done(err, 'done');
//       });
//     }
//   ], function(err) {
//     if (err) return next(err);
//     res.redirect('/forgot');
//   });
// });

// app.get("/confirmation",function(req,res){
// 	res.render("confirmation");
// })

// app.get('/reset/:token', function(req, res) {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//     if (!user) {
//       req.flash('error', 'Password reset token is invalid or has expired.');
//       return res.redirect('/forgot');
//     }
//     res.render('reset', {token: req.params.token});
//   });
// });

// app.post('/reset/:token', function(req, res) {
//   async.waterfall([
//     function(done) {
//       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
//         if (!user) {
//           req.flash('error', 'Password reset token is invalid or has expired.');
//           return res.redirect('back');
//         }
//         if(req.body.password === req.body.confirm) {
//           user.setPassword(req.body.password, function(err) {
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpires = undefined;

//             user.save(function(err) {
//               req.logIn(user, function(err) {
//                 done(err, user);
//               });
//             });
//           })
//         } else {
//             req.flash("error", "Passwords do not match.");
//             return res.redirect('back');
//         }
//       });
//     },
//     function(user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail', 
//         auth: {
//           user: 'karlevedant7@gmail.com',
//           pass: 'Einstine@7'
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'karlevedant7@mail.com',
//         subject: 'Your password has been changed',
//         text: 'Hello,\n\n' +
//           'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err) {
//         req.flash('success', 'Success! Your password has been changed.');
//         done(err);
//       });
//     }
//   ], function(err) {
//     res.redirect('/home');
//   });
// });


// //machines

// app.get("/machines",function(req,res){
// 	res.render("machines");
// })

// app.get("/dashboard",function(req,res){
// 	res.render("dashboard")
// })

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
// 	req.flash("error","Please Login First!");
//     res.redirect("/login");
// }

app.listen(3000,process.env.IP)
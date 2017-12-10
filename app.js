var express=require("express"),path=require("path"),cookieParser=require("cookie-parser"),bodyParser=require("body-parser"),exphbs=require("express-handlebars"),expressValidator=require("express-validator"),flash=require("connect-flash"),session=require("express-session"),passport=require("passport"),LocalStrategy=require("passport-local").Strategy,mongo=require("mongodb"),mongoose=require("mongoose"),dbURI="mongodb://localhost/canary";mongoose.connect(dbURI);var db=mongoose.connection,routes=require("./routes/index"),users=require("./routes/users"),articles=require("./routes/articles"),app=express();app.use(bodyParser.urlencoded()),app.use(bodyParser.json()),app.set("views",path.join(__dirname,"views")),app.engine("handlebars",exphbs({defaultLayout:"layout"})),app.set("view engine","handlebars"),app.use(express.static(path.join(__dirname,"public"))),app.use(session({secret:"extremelysecretfingerprints0011",saveUninitialized:!0,resave:!0})),app.use(passport.initialize()),app.use(passport.session()),app.use(expressValidator({errorFormatter:function(e,s,r){for(var a=e.split("."),o=a.shift(),p=o;a.length;)p+="["+a.shift()+"]";return{param:p,msg:s,value:r}}})),app.use(flash()),app.use(function(e,s,r){s.locals.success_msg=e.flash("success_msg"),s.locals.error_msg=e.flash("error_msg"),s.locals.error=e.flash("error"),s.locals.user=e.user||null,r()}),app.use("/",routes),app.use("/users",users),app.use("/api",articles),app.listen(process.env.PORT||3e3,function(){console.log("Express server listening on port %d in %s mode",this.address().port,app.settings.env)});
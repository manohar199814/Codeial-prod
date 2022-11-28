const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-outh2-startegy');
const MongoDbStore  = require('connect-mongo');

//used to parse scss to css
const sassMiddleware = require('node-sass-middleware');
//used to display flash messages
const flash = require('connect-flash');
const customMware = require('./config/middleware')

const path = require('path');
const port = 8000;

const app = express();

const chatServer = require("http").Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat srver is listening on port 5000')

if (env.name == 'development'){
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, env.asset_path,'scss'),
    dest: path.join(__dirname, env.asset_path ,'css'),
    debug: true,
    outputStyle: 'extended',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
}

//static files folder
console.log(env.asset_path);
app.use(express.static(env.asset_path));

//make upload path available to browser
app.use('/uploads',express.static('./uploads'))

app.use(logger(env.morgan.mode, env.morgan.options));
//set up view engine type
app.set('view engine','ejs');
//view folder path
app.set('views',path.join(__dirname,'views'));

app.use(expressLayouts);
//extract styles and scripts for subpages into layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//body parser
app.use(bodyParser.urlencoded({extended:true}));

//cookie parser
app.use(cookieParser())

//mongo store is used to store session cookie in db
app.use(session({
    name:'codeial',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: MongoDbStore.create({ mongoUrl: 'mongodb://0.0.0.0:27017/codeial_development' })
}));

app.use(passport.initialize());
app.use(passport.session());
//user information is passed to locals when user is authenticated
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes'));

app.listen(port,(err) => {
    if(err) {
        console.log(err);
    }
    console.log('server started on port 8000');
});

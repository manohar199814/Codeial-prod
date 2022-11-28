const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name:'development',
    asset_path:'assets',
    session_cookie_key:'blahsomething',
    db:'codeial_development',
    smtp:{
        service:'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'manoharmanu2614', // gmail user name
          pass: 'ngznhctlojrnobug', // gmail password
        },
    },
    google_client_id:'27346747973-f4bfdga5t0094l7fmmcltrj40ijv0n4q.apps.googleusercontent.com',
    google_client_secret: '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',
    google_callback_url: "http://localhost:8000/user/auth/google/callback",
    jwt_secret:'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_RURL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
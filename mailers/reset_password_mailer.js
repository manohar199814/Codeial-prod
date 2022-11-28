const nodemailer = require('../config/nodemailer');

exports.resetPassword = async (userName,userEmail,token) => {
    let htmlString = nodemailer.renderTemplate({user:userName,acessToken:token},'/users/reset_pass.ejs');
    let info = await nodemailer.transporter.sendMail({
        from: 'manoharmanu2614@gmail.com', // sender address
        to: userEmail, // list of receivers
        subject: "Reset Password link", // Subject line
        html: htmlString, // html body
      });
}
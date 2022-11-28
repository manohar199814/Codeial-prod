const nodemailer = require('../config/nodemailer');

exports.newComment = async (comment) => {
    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    console.log(htmlString,'in comment mailer');
    let info = await nodemailer.transporter.sendMail({
        from: 'manoharmanu2614@gmail.com', // sender address
        to: comment.user.email, // list of receivers
        subject: "New Comment Published", // Subject line
        html: htmlString, // html body
      });
}
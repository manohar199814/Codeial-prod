const queue = require('../config/kue');

const commentsMailer = require('../mailers/comment_mailer');

queue.process('emails', function(job, done){
    console.log('in emial queue process')
    console.log('emails worker is processing job',job.data);
    commentsMailer.newComment(job.data);
    done();
});
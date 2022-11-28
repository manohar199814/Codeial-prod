const Comment = require('../models/comment');
const Post = require('../models/posts');
const commentsMailer = require('../mailers/comment_mailer');
const queue = require('../config//kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function (req,res) {

    if(req.xhr){

        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await (await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            })).populate('user','name email');
            post.comments.push(comment);
            post.save();
            req.flash('success','comment posted');
            // commentsMailer.newComment(comment)

            let job = queue.create('emails',comment).save( function(err){
                console.log('in email queue create')
                if( err ) {
                    console.log('error in sending mails', job.id );
                    return
                };

                console.log('job enqued',job.id)
             });
            return res.status(200).json({
                data:{
                    comment:comment
                },
                message:"Comment Posted",
                success:req.flash('success')
            })
        }
        
    }

    
    res.redirect('back');
    
}

module.exports.destroy = async function(req,res) {
    try{
        let comment = await Comment.findById(req.params.id);
        if(req.user.id == comment.user) {
            let postId = comment.post;
            comment.remove();
            let post = await Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}});
            if(req.xhr){
                req.flash('success','comment deleted');
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    },
                    message:"comment Deleted",
                    success:req.flash('success')
                })
           }
            return res.redirect('back');
        }else{
            req.flash('error','You cant delete Comment');
            return res.redirect('back');
        }   

    }catch(err){
        req.flash('error',err);
        return;
    }
}
const Post = require('../models/posts');
const Comment = require('../models/comment');

module.exports.create = async function (req,res) {
    try{
        let post = await (await Post.create({content : req.body.content, user:req.user._id})).populate('user','name');
        if(req.xhr) {
            
            req.flash('success','Post Created');
            return res.status(200).json({ 
                data:{
                    post:post
                },
                message:"Post Created",
                success:req.flash('success')
            })
        }
        return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
//     Post.create({content : req.body.content, user:req.user._id},(err,post) =>{
//         if(err){
//             console.log('error in creating post');
//         }
//         return res.redirect('back');
//     });
// }
}

module.exports.destroy = async function(req,res) {
    try{
        let post = await Post.findById(req.params.id);
        if(req.user.id == post.user) {
           post.remove();
           await Comment.deleteMany({post: req.params.id});
           if(req.xhr){
                req.flash('success','Post and comments of post deleted');
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"Post Deleted",
                    success:req.flash('success')
                })
           }
            return res.redirect('back');
        }else{
            req.flash('error','You cant delete Post');
            return res.redirect('back');
        }            
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
    // Post.findById(req.params.id,(err,post) => {
    //     if(err){ 
    //         res.redirect('back')
    //     }
    //     // .id means converting the object id to string
    //     if(req.user.id == post.user) {
    //         // Post.deleteOne({id :req.params.id });
    //         post.remove();
    //         Comment.deleteMany({post: req.params.id},(err,count) => {
    //             return res.redirect('back');
    //         });
    //     }else{
    //         return res.redirect('back');
    //     }   
    // })
}
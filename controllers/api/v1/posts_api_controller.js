const Post = require('../../../models/posts');
const Comment = require('../../../models/comment');
module.exports.index = async function(req,res){
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user','name')
        .populate({
            path:'comments',
            populate:{
                path:'user',
                select:'name'
            }
        });

        res.status(200).json({
            message:'List of Posts ',
            posts:posts
        })
        
    }catch(err){
        console.log('Error',err);
        return;
    } 
}

module.exports.delete = async function(req,res) {
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post: req.params.id});
            return res.status(200).json({
                message:"Post and related comments Deleted",    
            })
        }else{
            return res.status(401).json({
                message:"You can't delete this post"
            })
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error",    
        })
    }
}
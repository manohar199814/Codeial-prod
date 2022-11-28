const Post = require('../models/posts');
const User = require('../models/user');
module.exports.home = async function (req,res) {
    // console.log(req.cookies);
    // res.cookie('user_id',14);
    // Post.find({},function(err, posts) {
    //     if(err){
    //         console.log('Error in fetching posts from DB');
    //         return;
    //     }
    //     return res.render('home', {title: 'home',posts:posts});
    // });

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
        let users = await  User.find({}); 
        return res.render('home', {
            title: 'home',
            posts:posts,
            all_users:users
        });
    }catch(err){
        console.log('Error',err);
        return;
    } 
}

module.exports.cart = function (req,res) {
    res.send('<h1> From home control router cart </h1>');
}


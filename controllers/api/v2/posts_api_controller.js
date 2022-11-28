module.exports.index = function(req,res){
    res.status(200).json({
        message:'List of Posts V2 ',
        posts:[]
    })
}
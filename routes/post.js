const postModel = require('../models/Post');
const postRouter = require('express').Router();
const userModel = require('../models/User');

//create a post

postRouter.post('/',async (req,res) => {
    const newPost = new postModel(req.body);
    try{
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    }catch(err) {
        console.log(err);
        return res.status(500).json({message : "Something went wrong!"});
    }
} )

//update post
postRouter.put('/:id',async (req,res) => {
    try{

        const post = await postModel.findById(req.params.id);
        if(req.body.userId === post.userId) {
            await post.updateOne({$set : req.body});
            return res.status(200).json(post);
        }
        else {
            return res.status(500).json({message : "You can update only your posts"});
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went Wrong!"});
    }
})

//delete post

postRouter.delete('/:id', async (req,res) => {


try{

    const post = await postModel.findById(req.params.id);
    console.log(post.userId);
    console.log(req.body);
    if(req.body.userId===post.userId)
    {
        await post.deleteOne();
        return res.status(200).json({message:"Your post has been deleted!"});
    }else{
        return res.status(500).json({message:"You can delete only your post!"});
    }

}
catch(err){

   console.log(err);
   return res.status(500).json({message:"Something went wrong!"});

}

})

//likes or dislikes

postRouter.put('/:id/like', async (req,res) => {
     
   try{

    const post = await postModel.findById(req.params.id);
    if(!post.likes.includes(req.body.userId))
    {
        await post.updateOne({$push : {likes : req.body.userId}});
        return res.status(200).json({message : "Post Liked!"});
    } else {
        await post.updateOne({$pull : {likes : req.body.userId}});
        return res.status(200).json({message : "Post Disliked!"});
    }

   } catch (err){
    return res.status(500).json({message:"Something went wrong!"});
   }

})

postRouter.get('/:id', async (req,res) => {
    try{
     const user= await userModel.findById(req.params.id) 
     const posts= await postModel.find({userId:req.params.id});
     return res.status(200).json(posts);

    } catch(err){
        return res.status(500).json({message:"Something went wrong!"});
    }
})

postRouter.get('/timeline/:id',async (req,res) => {
    try{
   
        const user= await userModel.findById(req.params.id);
        const currentUserPosts = await postModel.find({userId:req.params.id});
        const friendsPosts = await Promise.all(
            user.followings.map(friendId => {
               return postModel.find({userId : friendId})
            })
        );
        // return res.status(200).json(currentUserPosts);
        return res.status(200).json(currentUserPosts.concat(...friendsPosts));

    } catch (err) {

       console.log(err);
       return res.status(500).json({message : "Something went wrong!"});

    }
})

// postRouter.get('/profile/');

module.exports = postRouter;
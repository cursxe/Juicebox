const express = require("express");
const postsRouter = express.Router();
const {requireUser} = require("./utils");
const {getAllPosts, createPost} = require("../db");

postsRouter.post("/", requireUser, async (req,res,next) => {
    const { title, tags="", content} = req.body;
    const tagArr =  tags.trim().split(/\s+/);
    const postData = {title,content};
    if (tagArr.length) {
        postData.tags = tagArr;
    }
        
  try {
    const post=await createPost(postData);
    if(post){res.send({post});
  }
    next(error)
    } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.get('/', async (req,res) => {
    const post = await getAllPosts();
    res.send({post});
})


const Blog = require('../models/Blog.js');
const mongoose = require('mongoose');

const postBlog = async (req, res, next) => {
    try {
        const { authorName, title, content, authorAvatar } = req.body;

        const blog = new Blog({
            _id: new mongoose.Types.ObjectId(),
            authorName,
            title,
            content,
            authorAvatar
        });

        const result = await blog.save();
        res.status(200)
            .json({
                custom: "Blog Posted!!"
            });
    }
    catch (err) {
        console.log("Error Occurred:", err);
        res.status(403)
            .json({
                custom: "Error in posting the blog"
            });
    }
};

const getAllBlogs = async (req, res, next) => {
    try {
        const result = await Blog.find()
        res.status(200).json({
            data: result
        });
    } catch (err) {
        console.log("Error while Fetching Blogs:", err);
        res.status(403).json({
            custom: "Error in fetching blogs: " + err
        });
    }
};


module.exports = { postBlog, getAllBlogs };
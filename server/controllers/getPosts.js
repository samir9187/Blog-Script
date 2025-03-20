import Post from "../models/post.js";
import User from "../models/user.js";

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; 
    const posts = await Post.find()
      .populate("Author", "username")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments();
    res.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};


export const getPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate("Author", "username");
  res.json(post);
};

export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Find user by username
    const user = await User.findOne({ username }).select("_id");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find posts by user ID and paginate
    const userPosts = await Post.find({ Author: user._id })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("Author", "username");

    const totalPosts = await Post.countDocuments({ Author: user._id });

    res.json({
      posts: userPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};



export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { name, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const newComment = {
      user: name,
      content,
    };

    post.Comments.push(newComment);
    await post.save();
    // res.status(200).json(await post.save());
    res.status(200).json(post.Comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

import Post from "../models/post.js";

export const getPosts = async (req, res) => {
  const Posts = await Post.find()
    .populate("Author", "username")
    .sort({ updatedAt: -1 })
    .limit(20);
  res.json(Posts);
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id).populate("Author", "username");
  res.json(post);
};

export const getUserPosts = async (req, res) => {
  const username = req.params.username;
  const allPosts = await Post.find().populate("Author", "username");
  const userPosts = allPosts
    .filter((post) => post.Author.username === username)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  res.json(userPosts);
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

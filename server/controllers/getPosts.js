import Post from "../models/post.js";

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Default page=1, limit=10
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
    const { page = 1, limit = 5 } = req.query; 

    const userPosts = await Post.find()
      .populate("Author", "username")
      .then((posts) =>
        posts
          .filter((post) => post.Author.username === username)
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );

    const paginatedPosts = userPosts.slice((page - 1) * limit, page * limit);

    res.json({
      posts: paginatedPosts,
      totalPages: Math.ceil(userPosts.length / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
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

import Post from "../models/post.js";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { getDataUri } from "../middleware/dataUri.js";

const NewPost = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Authorization required.");

    const userInfo = jwt.verify(token, process.env.SECRET);
    if (!userInfo) return res.status(401).json("Invalid token.");

    const { Title, Summary, Content } = req.body;
    const file = req.file;

    if (!Title || !Summary || !Content) {
      return res.status(400).json("All required fields must be filled.");
    }

    let Cover = null;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudUri = await cloudinary.v2.uploader.upload(fileUri.content);
      Cover = cloudUri.secure_url;
    }

    const newPost = new Post({
      Title,
      Summary,
      Cover,
      Content,
      Author: userInfo.id,
    });

    const res = await newPost.save();
    return res.status(200).json("ok");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error. Please try again.");
  }
};

export default NewPost;

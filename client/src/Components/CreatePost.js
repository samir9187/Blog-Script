import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !summary || !content) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Summary", summary);
    formData.append("Content", content);

    if (file) {
      formData.append("Cover", file); // Append only if file is selected
    }

    const token = localStorage.getItem("Authtoken");

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/newpost`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (result === "ok") {
      navigate("/");
    } else {
      alert("Error! Please fill all required fields.");
    }
  }

  return (
    <div className="createpost">
      <div>
        <h1>Create a Post</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        <input
          type="text"
          required
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary"
          value={summary}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <h3>Content</h3>
        <ReactQuill
          onChange={(content) => setContent(content)}
          className="QuillContent"
          theme="snow"
          value={content}
        />
        <button type="submit" className="Btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './CreatePost.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/getPosts/${id}`)
            .then(response => response.json())
            .then(PostInfo => {
                setTitle(PostInfo.Title);
                setSummary(PostInfo.Summary);
                setContent(PostInfo.Content);
            })
            .catch(error => console.error("Error fetching post:", error));
    }, [id]);

    async function updatePost(e) {
        e.preventDefault();
        alert('If you don’t attach any image, the post will still have the previous image');

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Summary', summary);
        formData.append('Content', content);
        formData.append('id', id);
      
    if (file) {
        formData.append("Cover", file); 
    }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/updatePost`, {
                method: 'PUT',
                body: formData,
            });

            const textResponse = await response.text();
            console.log("Server response:", textResponse);

            const jsonResponse = JSON.parse(textResponse);

            if (jsonResponse === 'ok') {
                navigate(`/${id}`);
            } else {
                alert('Error! Fill all fields');
            }
        } catch (error) {
            console.error("Error updating post:", error);
            alert('Failed to update the post.');
        }
    }

    return (
        <div className='createpost'>
            <div>
                <h1>Edit Post</h1>
            </div>
            <form onSubmit={updatePost}>
                <input type='text' required onChange={(e) => setTitle(e.target.value)} placeholder='Title' value={title} />
                <input type='text' onChange={(e) => setSummary(e.target.value)} placeholder='Summary' value={summary} />
                <input type='file' onChange={(e) => setFile(e.target.files[0])} />
                <h3>Content</h3>
                <ReactQuill onChange={(content) => setContent(content)} className='QuillContent' theme="snow" value={content} />
                <button type="submit" className='Btn'>Update Post</button>
            </form>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./post";
import Loader from "./Loader";
import "./IndexPage.css";

export default function UserPosts() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/getPosts/userposts/${username}?page=${page}&limit=${limit}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user posts");
        }

        console.log("User Posts Data:", data); 

        setPosts(data.posts || []); 
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username, page]);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
    
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    if (startPage > 1) {
      buttons.push(
        <button 
          key="first" 
          onClick={() => setPage(1)}
          className="pagination-button"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`pagination-button ${page === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      
      buttons.push(
        <button
          key="last"
          onClick={() => setPage(totalPages)}
          className="pagination-button"
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Posts by @{username}</h1>
      
      {loading ? (
        <Loader />
      ) : (
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post._id} {...post} />)
          ) : (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          )}

          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
                className="pagination-nav-button"
              >
                &laquo; Prev
              </button>
              
              <div className="pagination-buttons">
                {renderPaginationButtons()}
              </div>
              
              <button 
                onClick={() => setPage(page + 1)} 
                disabled={page === totalPages}
                className="pagination-nav-button"
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
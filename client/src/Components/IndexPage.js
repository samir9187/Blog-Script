import { useEffect, useState } from "react";
import Post from "./post";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./IndexPage.css";
import Loader from "./Loader";

export default function IndexPage() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  useEffect(() => {
    fetchPosts();
  }, [page, searchText]);

  function fetchPosts() {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/getPosts?page=${page}&limit=${limit}&search=${searchText}`,
      { method: "GET" }
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }

  function startListening() {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  }

  function speechSearch() {
    SpeechRecognition.stopListening();
    if (transcript === "") return;
    setSearchText(transcript);
  }

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
      <div className="search-container">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {browserSupportsSpeechRecognition && (
          <div>
            {listening ? (
              <button className="speech" onClick={speechSearch}>
                Stop
              </button>
            ) : (
              <button className="speech" onClick={startListening}>
                Voice Search
              </button>
            )}
          </div>
        )}
      </div>

      <p>{listening && transcript}</p>

      {loading ? (
        <Loader />
      ) : (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post._id} {...post} />)
          ) : (
            <p className="no-posts-message">No posts found.</p>
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
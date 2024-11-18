import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import CreatePost from "./components/CreatePost";
import PostDetail from "./components/PostDetail"; // Import the PostDetail component
import { supabase } from "./client/client.js";

function App() {
    const [posts, setPosts] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("created_at");

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order(sortCriteria, { ascending: false });

            if (error) {
                console.error("Error fetching posts:", error);
            } else {
                setPosts(data);
            }
        };

        fetchPosts();
    }, [sortCriteria]);

    const isImageLink = (url) => {
        return /\.(jpg|jpeg|png|gif|webp)$/.test(url);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString).toLocaleDateString(
            undefined,
            options
        );
        const time = new Date(dateString).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${date} at ${time}`;
    };

    const handleSortChange = (criteria) => {
        setSortCriteria(criteria);
    };

    return (
        <Router>
            <div className='App'>
                <nav className='navbar'>
                    <div className='navbar-left'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='search-box'
                        />
                    </div>
                    <div className='navbar-right'>
                        <Link to='/' className='home-button'>
                            Home
                        </Link>
                        <Link to='/create-post' className='create-post-button'>
                            Create New Post
                        </Link>
                    </div>
                </nav>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <>
                                <header className='header'>
                                    <h1>PrintInspire</h1>
                                    <p>
                                        Discover, share, and get inspired by
                                        amazing 3D print projects from the
                                        community. Share your own creations,
                                        find new ideas, and connect with fellow
                                        makers!
                                    </p>
                                </header>
                                <div className='sort-container'>
                                    <span className='sort-label'>Sort By:</span>
                                    <button
                                        className={`sort-button ${
                                            sortCriteria === "created_at"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSortChange("created_at")
                                        }
                                    >
                                        Created Time
                                    </button>
                                    <button
                                        className={`sort-button ${
                                            sortCriteria === "upvotes"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSortChange("upvotes")
                                        }
                                    >
                                        Upvotes
                                    </button>
                                </div>
                                <main className='main-content'>
                                    {posts.map((post) => (
                                        <Link
                                            to={`/post/${post.id}`}
                                            key={post.id}
                                            className='post-card-link'
                                        >
                                            <div className='post-card'>
                                                <h2>{post.title}</h2>
                                                <p>{post.description}</p>
                                                {post.mediaLink &&
                                                    (isImageLink(
                                                        post.mediaLink
                                                    ) ? (
                                                        <img
                                                            src={post.mediaLink}
                                                            alt='Preview'
                                                            className='post-image'
                                                            onError={(e) => {
                                                                e.target.onerror =
                                                                    null;
                                                                e.target.src =
                                                                    "https://via.placeholder.com/300";
                                                            }}
                                                        />
                                                    ) : (
                                                        <iframe
                                                            src={post.mediaLink}
                                                            title={post.title}
                                                            className='post-iframe'
                                                            frameBorder='0'
                                                            allowFullScreen
                                                        ></iframe>
                                                    ))}
                                                <p>Upvotes: {post.upvotes}</p>
                                                <p>
                                                    Created at:{" "}
                                                    {formatDate(
                                                        post.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </main>
                            </>
                        }
                    />
                    <Route path='/create-post' element={<CreatePost />} />
                    <Route path='/post/:id' element={<PostDetail />} />{" "}
                    {/* Add the PostDetail route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

import { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useLocation,
} from "react-router-dom";
import "./App.css";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import PostDetail from "./components/PostDetail";
import { supabase } from "./client/client.js";

function AppContent() {
    const [posts, setPosts] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("created_at");
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

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
    }, [sortCriteria, location.pathname]);

    const isImageLink = (url) => {
        return /\.(jpg|jpeg|png|gif|webp)$/.test(url);
    };

    const getThumbnailLink = (link) => {
        if (link.includes("youtube.com/watch?v=")) {
            const videoId = link.split("v=")[1];
            const ampersandPosition = videoId.indexOf("&");
            const id =
                ampersandPosition !== -1
                    ? videoId.substring(0, ampersandPosition)
                    : videoId;
            return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        } else if (link.includes("youtu.be")) {
            const videoId = link.split("youtu.be/")[1];
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        } else if (link.includes("youtube.com/shorts")) {
            const videoId = link.split("shorts/")[1];
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        } else if (link.includes("vimeo.com")) {
            const videoId = link.split(".com/")[1];
            // Vimeo thumbnails require an API call to get the thumbnail URL
            // For simplicity, we'll return a placeholder image
            return `https://via.placeholder.com/300`;
        }
        return link;
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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='App'>
            <nav className='navbar'>
                <div className='navbar-left'>
                    <Link to='/' className='logo'>
                        PrintInspire
                    </Link>
                </div>
                <div className='navbar-center'>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='search-box'
                        value={searchQuery}
                        onChange={handleSearchChange}
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
                                    Discover, share, and get inspired by amazing
                                    3D print projects from the community. Share
                                    your own creations, find new ideas, and
                                    connect with fellow makers!
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
                                    onClick={() => handleSortChange("upvotes")}
                                >
                                    Upvotes
                                </button>
                            </div>
                            <main className='main-content'>
                                {filteredPosts.map((post) => {
                                    const totalTime =
                                        parseFloat(post.printTime) +
                                        parseFloat(post.assemblyTime);
                                    return (
                                        <Link
                                            to={`/post/${post.id}`}
                                            key={post.id}
                                            className='post-card-link'
                                        >
                                            <div className='post-card'>
                                                <h2>{post.title}</h2>
                                                <p>
                                                    Print and Assembly Time:{" "}
                                                    {totalTime} hrs
                                                </p>
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
                                                        <img
                                                            src={getThumbnailLink(
                                                                post.mediaLink
                                                            )}
                                                            alt='Video Thumbnail'
                                                            className='post-image'
                                                            onError={(e) => {
                                                                e.target.onerror =
                                                                    null;
                                                                e.target.src =
                                                                    "https://via.placeholder.com/300";
                                                            }}
                                                        />
                                                    ))}
                                                <p>Upvotes: {post.upvotes}</p>
                                                <p>
                                                    {" "}
                                                    {formatDate(
                                                        post.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </main>
                        </>
                    }
                />
                <Route path='/create-post' element={<CreatePost />} />
                <Route path='/edit-post/:id' element={<EditPost />} />{" "}
                {/* Add the EditPost route */}
                <Route path='/post/:id' element={<PostDetail />} />{" "}
                {/* Add the PostDetail route */}
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;

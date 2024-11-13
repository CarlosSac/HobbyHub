import { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useLocation,
} from "react-router-dom";
import "./App.css";
import CreatePost from "./components/CreatePost";

function App() {
    const [count, setCount] = useState(0);

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
                        <ConditionalCreatePostButton />
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
                                <main className='main-content'>
                                    <div className='post-card'>
                                        <h2>Project Title 1</h2>
                                        <p>
                                            Description of the first project...
                                        </p>
                                    </div>
                                    <div className='post-card'>
                                        <h2>Project Title 2</h2>
                                        <p>
                                            Description of the second project...
                                        </p>
                                    </div>
                                    <div className='post-card'>
                                        <h2>Project Title 3</h2>
                                        <p>
                                            Description of the third project...
                                        </p>
                                    </div>
                                </main>
                            </>
                        }
                    />
                    <Route path='/create-post' element={<CreatePost />} />
                </Routes>
            </div>
        </Router>
    );
}

function ConditionalCreatePostButton() {
    const location = useLocation();
    if (location.pathname === "/create-post") {
        return null;
    }
    return (
        <Link to='/create-post' className='create-post-button'>
            Create New Post
        </Link>
    );
}

export default App;

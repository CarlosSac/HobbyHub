import { useState } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
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
                    <button className='home-button'>Home</button>
                    <button className='create-post-button'>
                        Create New Post
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default App;

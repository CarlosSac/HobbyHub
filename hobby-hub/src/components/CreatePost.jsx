import React from "react";
import "./CreatePost.css";

function CreatePost() {
    return (
        <div className='create-post-container'>
            <div className='create-post-card'>
                <h2>Create a New Post</h2>
                <form>
                    <div className='form-group'>
                        <label>Title:</label>
                        <input type='text' name='title' />
                    </div>
                    <div className='form-group'>
                        <label>Description:</label>
                        <textarea name='description'></textarea>
                    </div>
                    <div className='form-group'>
                        <label>Link:</label>
                        <input type='text' name='link' />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;

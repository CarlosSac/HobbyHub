import React, { useState } from "react";
import "./CreatePost.css";
import { supabase } from "../client/client.js"; // Import the named export
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CreatePost() {
    const [title, setTitle] = useState("");
    const [printTime, setPrintTime] = useState("");
    const [assemblyTime, setAssemblyTime] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [mediaLink, setMediaLink] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.from("posts").insert([
            {
                title,
                printTime,
                assemblyTime,
                description,
                link,
                mediaLink,
            },
        ]);

        if (error) {
            console.error("Error inserting data:", error);
        } else {
            console.log("Data inserted successfully:", data);
            navigate("/"); // Redirect to home page
        }
    };

    const handleMediaLinkChange = (e) => {
        setMediaLink(e.target.value);
    };

    const getEmbedLink = (link) => {
        if (link.includes("youtube.com/watch?v=")) {
            const videoId = link.split("v=")[1];
            const ampersandPosition = videoId.indexOf("&");
            return `https://www.youtube.com/embed/${
                ampersandPosition !== -1
                    ? videoId.substring(0, ampersandPosition)
                    : videoId
            }`;
        } else if (link.includes("youtu.be")) {
            const videoId = link.split("youtu.be/")[1];
            return `https://www.youtube.com/embed/${videoId}`;
        } else if (link.includes("youtube.com/shorts")) {
            const videoId = link.split("shorts/")[1];
            return `https://www.youtube.com/embed/${videoId}`;
        } else if (link.includes("vimeo.com")) {
            const videoId = link.split(".com/")[1];
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return link;
    };

    const isVideoLink = (link) => {
        return (
            link.includes("youtube.com") ||
            link.includes("youtu.be") ||
            link.includes("vimeo.com")
        );
    };

    return (
        <div className='create-post-container'>
            <div className='create-post-card'>
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Title:</label>
                        <input
                            type='text'
                            name='title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className='form-group inline-group'>
                        <div className='inline-item'>
                            <label>Print Time:</label>
                            <input
                                type='number'
                                name='printTime'
                                min='0'
                                value={printTime}
                                onChange={(e) => setPrintTime(e.target.value)}
                            />
                            <span className='unit'>hrs</span>
                        </div>
                        <div className='inline-item'>
                            <label>Assembly Time:</label>
                            <input
                                type='number'
                                name='assemblyTime'
                                min='0'
                                value={assemblyTime}
                                onChange={(e) =>
                                    setAssemblyTime(e.target.value)
                                }
                            />
                            <span className='unit'>hrs</span>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label>Description:</label>
                        <textarea
                            name='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='form-group'>
                        <label>Link:</label>
                        <input
                            type='text'
                            name='link'
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Image or Video Link:</label>
                        <input
                            type='text'
                            name='mediaLink'
                            value={mediaLink}
                            onChange={handleMediaLinkChange}
                        />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
                {mediaLink && (
                    <div className='media-preview'>
                        {isVideoLink(mediaLink) ? (
                            <iframe
                                width='100%'
                                height='315'
                                src={getEmbedLink(mediaLink)}
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                                title='Embedded Video'
                            ></iframe>
                        ) : (
                            <img
                                src={mediaLink}
                                alt='Preview'
                                className='post-image'
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://via.placeholder.com/300";
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreatePost;

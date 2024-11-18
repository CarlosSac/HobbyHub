import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client/client.js"; // Adjust the import path as needed

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [printTime, setPrintTime] = useState("");
    const [assemblyTime, setAssemblyTime] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [mediaLink, setMediaLink] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
            } else {
                setTitle(data.title);
                setPrintTime(data.printTime);
                setAssemblyTime(data.assemblyTime);
                setDescription(data.description);
                setLink(data.link);
                setMediaLink(data.mediaLink);
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("posts")
            .update({
                title,
                printTime,
                assemblyTime,
                description,
                link,
                mediaLink,
            })
            .eq("id", id);

        if (error) {
            console.error("Error updating post:", error);
        } else {
            console.log("Post updated successfully:", data);
            navigate(`/post/${id}`);
        }
    };

    const isImageLink = (url) => {
        return /\.(jpg|jpeg|png|gif|webp)$/.test(url);
    };

    return (
        <div className='create-post-container'>
            <div className='create-post-card'>
                <h2>Edit Post</h2>
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
                            onChange={(e) => setMediaLink(e.target.value)}
                        />
                    </div>
                    <button type='submit'>Update Post</button>
                </form>
                {mediaLink && (
                    <div className='media-preview'>
                        {isImageLink(mediaLink) ? (
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
                        ) : (
                            <iframe
                                width='100%'
                                height='315'
                                src={mediaLink}
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                                title='Embedded Video'
                            ></iframe>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditPost;

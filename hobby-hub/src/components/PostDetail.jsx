import React, { useEffect, useState } from "react";
import "./PostDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client/client.js"; // Adjust the import path as needed

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [upvotes, setUpvotes] = useState(0);

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
                setPost(data);
                setUpvotes(data.upvotes);
            }
        };

        fetchPost();
    }, [id]);

    const handleUpvote = async () => {
        const { data, error } = await supabase
            .from("posts")
            .update({ upvotes: upvotes + 1 })
            .eq("id", id);

        if (error) {
            console.error("Error upvoting post:", error);
        } else {
            setUpvotes(upvotes + 1);
        }
    };

    const handleDelete = async () => {
        const { error } = await supabase.from("posts").delete().eq("id", id);

        if (error) {
            console.error("Error deleting post:", error);
        } else {
            navigate("/"); // Redirect to home page after deletion
        }
    };

    const handleEdit = () => {
        navigate(`/edit-post/${id}`); // Redirect to edit post page
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const totalTime =
        parseFloat(post.printTime) + parseFloat(post.assemblyTime);

    return (
        <div className='post-detail-card'>
            <div className='post-detail-header'>
                <h2>{post.title}</h2>
                <div className='post-detail-actions'>
                    <button onClick={handleEdit} className='edit-button'>
                        Edit
                    </button>
                    <button onClick={handleDelete} className='delete-button'>
                        Delete
                    </button>
                </div>
            </div>
            <p>{post.description}</p>
            <p>Print Time: {post.printTime} hrs</p>
            <p>Assembly Time: {post.assemblyTime} hrs</p>
            <p>Total Time: {totalTime} hrs</p>

            {post.mediaLink &&
                (isImageLink(post.mediaLink) ? (
                    <img
                        src={post.mediaLink}
                        alt='Preview'
                        className='post-image'
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300";
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
            <div className='upvote-container'>
                <button onClick={handleUpvote} className='upvote-button'>
                    Upvote ({upvotes})
                </button>
            </div>
        </div>
    );
}

const isImageLink = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/.test(url);
};

export default PostDetail;

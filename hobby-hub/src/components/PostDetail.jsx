import React, { useEffect, useState } from "react";
import "./PostDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client/client.js";

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");

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
        fetchComments();
    }, [id]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", id)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            setComments(data);
        }
    };

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("comments")
            .insert([{ post_id: id, content: commentContent }]);

        if (error) {
            console.error("Error submitting comment:", error);
        } else {
            setCommentContent("");
            fetchComments();
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const totalTime =
        parseFloat(post.printTime) + parseFloat(post.assemblyTime);

    return (
        <div className='post-detail-card'>
            <h2>{post.title}</h2>
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
            <div className='comments-section'>
                <h3>Comments</h3>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder='Add a comment...'
                        required
                    ></textarea>
                    <button type='submit'>Submit</button>
                </form>
                <div className='comments-list'>
                    {comments.map((comment) => (
                        <div key={comment.id} className='comment'>
                            <p>{comment.content}</p>
                            <span>
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const isImageLink = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/.test(url);
};

export default PostDetail;

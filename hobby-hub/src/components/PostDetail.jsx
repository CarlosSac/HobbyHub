import React, { useEffect, useState } from "react";
import "./PostDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client/client.js"; // Adjust the import path as needed

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [iframeError, setIframeError] = useState(false);

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("comments")
            .insert([{ post_id: id, content: commentContent }]);

        if (error) {
            console.error("Error submitting comment:", error);
        } else {
            setCommentContent("");
            fetchComments(); // Re-fetch comments after submitting a new comment
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const totalTime =
        parseFloat(post.printTime) + parseFloat(post.assemblyTime);

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

            {post.link && (
                <div className='post-link'>
                    {isVideoLink(post.link) ? (
                        <iframe
                            width='100%'
                            height='315'
                            src={getEmbedLink(post.link)}
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            title='Embedded Video'
                            onError={() => setIframeError(true)}
                        ></iframe>
                    ) : (
                        <a
                            href={post.link}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Get the files here
                        </a>
                    )}
                    {iframeError && (
                        <a
                            href={post.link}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Get the files here
                        </a>
                    )}
                </div>
            )}

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
                        src={getEmbedLink(post.mediaLink)}
                        title={post.title}
                        className='post-iframe'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        onError={() => setIframeError(true)}
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

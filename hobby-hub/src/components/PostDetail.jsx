import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../client/client.js"; // Adjust the import path as needed

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

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
            }
        };

        fetchPost();
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className='post-detail'>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
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
        </div>
    );
}

const isImageLink = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/.test(url);
};

export default PostDetail;

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ postId }) => {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Fetch like status
  useEffect(() => {
    if (!postId || !isSignedIn) return;

    const fetchLikedStatus = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/likes/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(data.liked);
        }
      } catch (err) {
        console.error("Failed to fetch like status", err);
      }
    };

    fetchLikedStatus();
  }, [postId, isSignedIn]);

  // Toggle like
  const toggleLike = async () => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    try {
      const token = await getToken();
      setAnimating(true); // Start animation

      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`${import.meta.env.VITE_API_URL}/likes/${postId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLiked(!liked);
      } else {
        console.error("Failed to toggle like:", await res.text());
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setTimeout(() => setAnimating(false), 300); // End animation
    }
  };

  return (
    <button
    onClick={toggleLike}
    className={`transition-transform duration-300 ${
      animating ? "animate-bounce-heart" : ""
    }`}
    aria-label="Like"
  >
      {liked ? (
        <FaHeart className="text-red-500 w-6 h-6" />
      ) : (
        <FaRegHeart className="text-[var(--softBg4)] hover:text-red-400 w-6 h-6" />
      )}
    </button>
  );
};

export default LikeButton;

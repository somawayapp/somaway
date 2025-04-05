import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

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
        console.error("Failed to fetch lik status", err);
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
  
    // Optimistically update UI
    const newLikedState = !liked;
    setLiked(newLikedState);
    setAnimating(true);
  
    try {
      const token = await getToken();
      const method = newLikedState ? "POST" : "DELETE";
  
      const res = await fetch(`${import.meta.env.VITE_API_URL}/likes/${postId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        // Revert back if request failed
        setLiked(!newLikedState);
        console.error("Failed to toggle like:", await res.text());
      }
    } catch (err) {
      // Revert back if request errored out
      setLiked(!newLikedState);
      console.error("Error toggling like:", err);
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };
  

  return (


<button
onClick={toggleLike}
className={`  relative hover:opacity-80 transition cursor-pointer z-[5] transition-transform duration-300 ${
  animating ? "animate-bounce-heart" : ""
}`}
aria-label="Like"
>

<AiOutlineHeart
  size={28}
  className="
    text-gray-50
    absolute
    -top-[2px]
    -right-[2px]
  "
/>
<AiFillHeart
  size={24}
  className={cn(liked ? "fill-blue-500" : "fill-neutral-500/70")}
/>
</button>

  );
};

export default LikeButton;

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const Star = ({ postId }) => {
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        // Fetch Ratings
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setRating(parseFloat(data.averageRating) || 0);
          setTotalReviews(data.totalRatings || 0);
        } else {
          console.error("Failed to fetch rating", await res.text());
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [postId]);

  return (
    <div className="flex flex-row gap-1 ml-2 items-center">
          <FaStar
            className="w-[11px] md:w-[15px]  mt-[-2px]"
            color= "var(--softTextColor)"
          />
    
      <span className="font-semibold text-[13px] md:text-[15px] flex items-center">
        <span className="text-[var(--softTextColor)] text-[13px] md:text-[15px] ">
          {Number(rating).toFixed(1)}
        </span>
      </span>
    </div>
  );
};

export default Star;

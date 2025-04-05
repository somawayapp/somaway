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
    <div className="flex flex-row ml-3 items-center mt-2 text-sm md:text-lg">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className="w-[40px] ml-[-15px]"
            color={starValue <= rating ? "var(--softTextColor)" : "var(--textColor)"}
          />
        );
      })}
      <span className="pl-2 font-normal text-[14px] md:text-[16px] flex items-center">
        <span className="text-[var(--softTextColor)] text-[14px] md:text-[16px] ml-[-5px]">
          {Number(rating).toFixed(1)}
        </span>
      </span>
    </div>
  );
};

export default Star;

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ postId }) => {
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hover, setHover] = useState(null);
  const [userRating, setUserRating] = useState(null); // Track user's own rating

  useEffect(() => {
    // Fetch the average rating & total reviews
    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/ratings/${postId}`);
        const data = await res.json();
        setRating(data.averageRating);
        setTotalReviews(data.totalRatings);
      } catch (err) {
        console.error("Failed to fetch rating", err);
      }
    };

    fetchRating();
  }, [postId]);

  const handleRating = async (stars) => {
    try {
      const res = await fetch(`/api/ratings/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stars }),
      });

      if (res.ok) {
        setUserRating(stars);
        setRating((prev) => ((prev * totalReviews + stars) / (totalReviews + 1)).toFixed(1));
        setTotalReviews((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  return (
    <div className="flex flex-row ml-3 items-center mt-2 text-sm md:text-lg">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className="w-[40px] ml-[-15px] cursor-pointer transition-all"
            color={starValue <= (hover || userRating || rating) ? "orange" : "var(--textColor)"}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleRating(starValue)}
          />
        );
      })}
      <span className="pl-2 font-normal text-[14px] md:text-[16px] flex items-center">
        <span className="text-[var(--softTextColor)] text-[14px] md:text-[16px] ml-[-5px]">
          {rating || "0.0"}
        </span>
        <span className="mx-2 flex items-center">·</span>
        {totalReviews} <span className="ml-1 text-[var(--softTextColor)] text-[14px] md:text-[16px]">reviews</span>
      </span>
    </div>
  );
};

export default Rating;

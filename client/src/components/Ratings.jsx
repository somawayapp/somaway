import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ postId }) => {
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hover, setHover] = useState(null);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/ratings/${postId}`);
        const data = await res.json();
        setRating(data.averageRating);
        setTotalReviews(data.totalRatings);
        setUserRating(data.userRating); // Fetch user's existing rating
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
        const newData = await res.json();
        setUserRating(stars); // Set user rating so it doesn't reset on hover
        setRating(newData.newAverage);
        setTotalReviews(newData.newTotal);
      } else {
        console.error("Failed to submit rating");
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
          {rating.toFixed(1)}
        </span>
        <span className="mx-2 flex items-center">·</span>
        {totalReviews} <span className="ml-1 text-[var(--softTextColor)] text-[14px] md:text-[16px]">revews</span>
      </span>
    </div>
  );
};


export default Rating;

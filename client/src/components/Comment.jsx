import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const Ratings = ({ postId, token }) => {
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hover, setHover] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings?postId=${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch ratings");

        const data = await res.json();
        setRating(parseFloat(data.averageRating) || 0);
        setTotalReviews(data.totalRatings || 0);
        setUserRating(data.userRating || 0);
      } catch (err) {
        console.error("Error fetching ratings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [postId, token]);

  const submitRating = async (stars) => {
    try {
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, stars }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      const newData = await res.json();
      setUserRating(stars);
      setRating(parseFloat(newData.newAverage));
      setTotalReviews(newData.newTotal);
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="flex flex-row ml-3 items-center mt-2 text-sm md:text-lg">
      {loading ? (
        <p>Loading...</p>
      ) : (
        [...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={index}
              className="w-[40px] ml-[-15px] cursor-pointer transition-all"
              color={starValue <= (hover || userRating || rating) ? "orange" : "var(--textColor)"}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              onClick={() => submitRating(starValue)}
            />
          );
        })
      )}
      <span className="pl-2 font-normal text-[14px] md:text-[16px] flex items-center">
        <span className="text-[var(--softTextColor)] text-[14px] md:text-[16px] ml-[-5px]">
          {Number(rating).toFixed(1)}
        </span>
        <span className="mx-2 flex items-center">·</span>
        {totalReviews} <span className="ml-1 text-[var(--softTextColor)] text-[14px] md:text-[16px]">reviews</span>
      </span>
    </div>
  );
};

export default Ratings;
import ReviewListItem from "./ReviewListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewItem from "./ReviewItem";
import { Link } from "react-router-dom";

const fetchReviews = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews`, {
    params: { ...searchParamsObj },
  });
  return res.data.reviews;
};

const ReviewList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumns(
        width > 1400
          ? "repeat(4, 1fr)"
          : width > 1000
          ? "repeat(3, 1fr)"
          : width > 640
          ? "repeat(2, 1fr)"
          : "repeat(1, 1fr)"
      );
    };

    window.addEventListener("resize", updateColumns);
    updateColumns(); // Initial call

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const [searchParams] = useSearchParams();
  const { data: allReviews = [], error, status } = useQuery({
    queryKey: ["reviews", searchParams.toString()],
    queryFn: () => fetchReviews(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [displayedReviews, setDisplayedReviews] = useState([]);

  useEffect(() => {
    if (allReviews.length === 0) return;

    let newReviews = [];
    let index = 0;

    const loadNextBatch = (batchSize) => {
      newReviews = [...newReviews, ...allReviews.slice(index, index + batchSize)];
      setDisplayedReviews([...newReviews]);
      index += batchSize;
    };

    loadNextBatch(4); 
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < allReviews.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [allReviews]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);
  
    return () => clearTimeout(timer);
  }, []);
  
  if (displayedReviews.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Link to="/addlistingreview"
          className=" px-6 py-3 rounded-xl border border-[var(--softBg4)] 
                     text-[var(--softTextColor)] shadow-md 
                     hover:text-[var(--textColor)] text-center">
          <p className="mb-2">No Reviews found for this property search</p>
          <p className="mb-2 font-bold">Add a new property and review it</p>
        </Link>
      </div>
    );
  }
  
  if (displayedReviews.length === 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: columns }} className="gap-6 md:gap-9 scrollbar-hide">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="relative aspect-[3/1] w-full">
            <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: columns }} className="gap-6 md:gap-9 scrollbar-hide">
      {displayedReviews.map((review) => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
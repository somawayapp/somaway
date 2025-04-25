import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import HistoryPostItem from "./HistoryPostItem";
// Utility to convert URLSearchParams to plain object
const parseSearchParams = (searchParams) =>
  searchParams instanceof URLSearchParams
    ? Object.fromEntries([...searchParams])
    : {};

const fetchPosts = async (searchParams) => {
  const params = {
    ...parseSearchParams(searchParams),
    sort: "random",
  };
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params,
  });

  const posts = res.data?.posts;
  console.log("Fetched posts:", posts);
  return Array.isArray(posts) ? posts : [];
};

const HistoryPostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [searchParams] = useSearchParams();
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  // Batching control
  const indexRef = useRef(0);
  const batchedRef = useRef([]);

  // Handle responsive column layout
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
    updateColumns();
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const {
    data: allPosts = [],
    error: postsError,
    status: postsStatus,
  } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!Array.isArray(allPosts)) {
      console.warn("Fetched posts are not an array:", allPosts);
      return;
    }

    if (postsStatus === "success") {
      // OPTIONAL: Add filtering logic here if needed
      const filteredPosts = allPosts; // e.g., allPosts.filter(post => post.status !== "archived");

      const combined = [...filteredPosts];
      indexRef.current = 0;
      batchedRef.current = [];

      const loadNextBatch = (batchSize) => {
        const nextBatch = combined.slice(indexRef.current, indexRef.current + batchSize);
        batchedRef.current = [...batchedRef.current, ...nextBatch];
        setDisplayedPosts([...batchedRef.current]);
        indexRef.current += batchSize;
      };

      loadNextBatch(4);
      setTimeout(() => loadNextBatch(4), 50);
      setTimeout(() => loadNextBatch(4), 100);
      setTimeout(() => {
        while (indexRef.current < combined.length) {
          loadNextBatch(8);
        }
      }, 150);
    }
  }, [allPosts, postsStatus]);

  // Loading state
  if (postsStatus === "loading") {
    return <p>Loading...</p>;
  }

  // Error state
  if (postsError) {
    return <p>Something went wrong!</p>;
  }

  // Guard against unexpected types
  if (!Array.isArray(displayedPosts)) {
    return <p>Unexpected error: displayedPosts is not an array</p>;
  }

  // No results with message
  if (displayedPosts.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <button
          onClick={() => (window.location.href = "/addlisting")}
          className="w-full px-6 py-3 rounded-xl border border-[var(--softBg4)] 
                     text-[var(--softTextColor)] shadow-md 
                     hover:text-[var(--textColor)] hover:shadow-xl text-center"
        >
          <p className="mb-2">No listings found</p>
          <p className="mb-2 font-bold">Go back home</p>
        </button>
      </div>
    );
  }

  {displayedPosts.length === 0 && !showMessage && (
    <div style={{ display: "grid", gridTemplateColumns: columns }} className="gap-6 h-full md:gap-9 scrollbar-hide">
      {Array(8).fill(0).map((_, index) => (
        <div key={index} className="relative w-full h-0 pb-[33.33%]">
          <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
        </div>
      ))}
    </div>
  )}  
  
  // Render the posts
  return (
     
      <div style={{ display: "grid", gridTemplateColumns: columns }} className="gap-6 md:gap-9 scrollbar-hide">
      {displayedPosts.map((post) => (
        <HistoryPostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default HistoryPostList;


import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Link from "next/link";

// Fetch regular posts
const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
      params: { ...searchParamsObj },
    });
    // IMPORTANT: Log the API response to inspect its structure
    console.log("API Response:", res.data);
    return res.data.posts; // Assuming the array of posts is under the 'posts' property
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return an empty array on error to prevent .map() issues initially
  }
};

const PostList = () => {
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
  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    // This effect runs whenever allPosts changes
    if (!allPosts || allPosts.length === 0) {
      setDisplayedPosts([]); // Clear out old data if allPosts is empty or undefined
      return;
    }

    let newPosts = [];
    let index = 0;

    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...allPosts.slice(index, index + batchSize)];
      setDisplayedPosts([...newPosts]);
      index += batchSize;
    };

    loadNextBatch(4);
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < allPosts.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [allPosts]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // 3-second delay

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  // Rendered when no posts are found after the initial delay
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

  // Initial loading state with skeleton UI
  if (displayedPosts.length === 0 && status === "loading") {
    return (
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 overflow-y-auto scrollbar-hide" style={{ height: 'calc(100vw * 8)' }}>
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="relative aspect-[3/3] w-full">
            <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  // Render the list of posts
  return (
    <div>
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
        {/* POTENTIAL ERROR POINT: Ensure displayedPosts is always an array here */}
        {displayedPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostList;

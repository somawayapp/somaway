import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Fetch functions
const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
};

const fetchFeaturedPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&sort=random`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
};

const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [searchParams] = useSearchParams();

  // Update columns on window resize
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

  // Queries
  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const { data: featuredPosts = [], error: featuredError, status: featuredStatus } = useQuery({
    queryKey: ["featuredPosts", searchParams.toString()],
    queryFn: () => fetchFeaturedPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  // Combine featured + allPosts
  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    if (allPosts.length === 0 && featuredPosts.length === 0) {
      setDisplayedPosts([]);
      return;
    }

    const featuredToShow = featuredPosts.slice(0, 4);
    const featuredIds = new Set(featuredToShow.map((post) => post._id));
    const remainingPosts = allPosts.filter((post) => !featuredIds.has(post._id));
    setDisplayedPosts([...featuredToShow, ...remainingPosts]);
  }, [allPosts, featuredPosts]);

  // Delayed empty message
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Loading
  if (status === "loading" || featuredStatus === "loading") {
    return (
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 overflow-y-auto scrollbar-hide min-h-[60vh]">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="relative aspect-[3/3] w-full">
            <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error
  if (error || featuredError) return <p>Something went wrong!</p>;

  // No posts after delay
  if (displayedPosts.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <Link
          to="/addlisting"
          className="w-full px-6 py-3 rounded-xl border border-[var(--softBg4)] 
                     text-[var(--softTextColor)] shadow-md 
                     hover:text-[var(--textColor)] hover:shadow-xl"
        >
          <p className="mb-2">No listings found</p>
          <p className="mb-2 font-bold">Add a new one</p>
        </Link>
      </div>
    );
  }

  // Final list
  return (
    <div
      className="gap-2 grid md:gap-6 scrollbar-hide"
      style={{ gridTemplateColumns: columns }}
    >
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

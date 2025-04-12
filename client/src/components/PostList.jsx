import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Utility to convert URLSearchParams to plain object
const parseSearchParams = (searchParams) =>
  searchParams instanceof URLSearchParams
    ? Object.fromEntries([...searchParams])
    : {};

const fetchPosts = async (searchParams) => {
  const params = parseSearchParams(searchParams);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
    params,
  });

  const posts = res.data?.posts;
  console.log("Fetched posts:", posts);
  return Array.isArray(posts) ? posts : [];
};

const fetchFeaturedPosts = async (searchParams) => {
  const params = {
    ...parseSearchParams(searchParams),
    featured: true,
    limit: 4,
    sort: "random",
  };

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
    params,
  });

  const featured = res.data?.posts;
  console.log("Fetched featured posts:", featured);
  return Array.isArray(featured) ? featured : [];
};

const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [searchParams] = useSearchParams();
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

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

  const {
    data: featuredPosts = [],
    status: featuredStatus,
  } = useQuery({
    queryKey: ["featured", "sort=random", searchParams.toString()],
    queryFn: () => fetchFeaturedPosts(searchParams),
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
    if (!Array.isArray(allPosts) || !Array.isArray(featuredPosts)) return;

    if (postsStatus === "success" && featuredStatus === "success") {
      const filteredPosts = allPosts.filter(
        (post) => !featuredPosts.find((f) => f._id === post._id)
      );
      const combined = [...featuredPosts, ...filteredPosts];

      let index = 0;
      let batched = [];

      const loadNextBatch = (batchSize) => {
        batched = [...batched, ...combined.slice(index, index + batchSize)];
        setDisplayedPosts([...batched]);
        index += batchSize;
      };

      loadNextBatch(4);
      setTimeout(() => loadNextBatch(4), 50);
      setTimeout(() => loadNextBatch(4), 100);
      setTimeout(() => {
        while (index < combined.length) {
          loadNextBatch(8);
        }
      }, 150);
    }
  }, [allPosts, featuredPosts, postsStatus, featuredStatus]);

  if (postsStatus === "loading" || featuredStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (postsError) return <p>Something went wrong!</p>;

  if (!Array.isArray(displayedPosts)) {
    return <p>Unexpected error: displayedPosts is not an array</p>;
  }

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

  if (displayedPosts.length === 0) {
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

  return (
    <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

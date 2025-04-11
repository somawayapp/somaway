import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
};

const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [searchParams] = useSearchParams();

  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const updateColumns = useCallback(() => {
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
  }, []);

  useEffect(() => {
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [updateColumns]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // 3-second delay
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  useEffect(() => {
    if (allPosts.length === 0) return;

    let index = 0;
    const loadNextBatch = (batchSize) => {
      const newPosts = [...displayedPosts, ...allPosts.slice(index, index + batchSize)];
      setDisplayedPosts(newPosts);
      index += batchSize;
    };

    loadNextBatch(4); // Initial batch of posts
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < allPosts.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [allPosts, displayedPosts]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  if (displayedPosts.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <button
          onClick={() => window.location.href = '/addlisting'}
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
    <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide" style={{ gridTemplateColumns: columns }}>
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

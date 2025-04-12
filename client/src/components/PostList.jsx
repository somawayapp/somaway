import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
    params: { ...searchParamsObj },
  });
  const posts = res.data?.posts;
  return Array.isArray(posts) ? posts : [];
};

const fetchFeaturedPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=random`);
  const posts = res.data?.posts;
  return Array.isArray(posts) ? posts : [];
};

const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const { data: allPosts = [], error: postsError, status: postsStatus } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const { data: featuredPosts = [], status: featuredStatus } = useQuery({
    queryKey: ["featured"],
    queryFn: fetchFeaturedPosts,
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
    if (postsStatus === "success" && featuredStatus === "success") {
      const filteredPosts = allPosts.filter(
        (post) => !featuredPosts.find((f) => f._id === post._id)
      );
      const combined = [...featuredPosts, ...filteredPosts];
      let index = 0;
      let batched = [];
      const loadNextBatch = (batchSize, delay) => {
        setTimeout(() => {
          batched = [...batched, ...combined.slice(index, index + batchSize)];
          setDisplayedPosts([...batched]);
          index += batchSize;
        }, delay);
      };

      loadNextBatch(4, 0);
      loadNextBatch(4, 50);
      loadNextBatch(4, 100);
      loadNextBatch(combined.length, 150);
    }
  }, [allPosts, featuredPosts, postsStatus, featuredStatus]);

  if (postsStatus === "loading" || featuredStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (postsError) {
    return <p>Something went wrong!</p>;
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

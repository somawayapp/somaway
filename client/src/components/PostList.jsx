import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Link from "next/link";

const fetchallPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
};

const fetchfeaturedPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=random`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
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
    updateColumns();

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const [searchParams] = useSearchParams();

  // ✅ Featured Posts Query
  const {
    data: featuredPostsData = [],
    error: featuredError,
    status: featuredStatus,
  } = useQuery({
    queryKey: ["featuredPosts", searchParams.toString()],
    queryFn: () => fetchfeaturedPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  // ✅ All Posts Query
  const {
    data: allPostsData = [],
    error: allPostsError,
    status: allPostsStatus,
  } = useQuery({
    queryKey: ["allPosts", searchParams.toString()],
    queryFn: () => fetchallPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  // ✅ Load All Posts in batches
  const [displayedPosts, setDisplayedPosts] = useState([]);
  useEffect(() => {
    if (allPostsData.length === 0) {
      setDisplayedPosts([]);
      return;
    }

    let newPosts = [];
    let index = 0;
    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...allPostsData.slice(index, index + batchSize)];
      setDisplayedPosts([...newPosts]);
      index += batchSize;
    };

    loadNextBatch(4);
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < allPostsData.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [allPostsData]);

  // ✅ Load Featured Posts in batches
  const [featuredPosts, setFeaturedPosts] = useState([]);
  useEffect(() => {
    if (featuredPostsData.length === 0) {
      setFeaturedPosts([]);
      return;
    }

    let newPosts = [];
    let index = 0;
    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...featuredPostsData.slice(index, index + batchSize)];
      setFeaturedPosts([...newPosts]);
      index += batchSize;
    };

    loadNextBatch(4);
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < featuredPostsData.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [featuredPostsData]);

  // ✅ Handle loading/error states
  if (featuredStatus === "loading" || allPostsStatus === "loading") return <p>Loading...</p>;
  if (featuredError || allPostsError) return <p>Something went wrong!</p>;

  // Optional: Delayed Message
  


  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // 2-second delay
  
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);
  
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
    <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Link from "next/link";

const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=random`, 
    {
      params: { ...searchParamsObj },
    }
  );
  return res.data.posts;
};

const fetchAllPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts&sort=random`, {
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
    updateColumns(); // Initial call

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const [searchParams] = useSearchParams();
  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", "random", searchParams.toString()],
    queryFn: () => fetchAllPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const { data: featuredPosts = [] } = useQuery({
    queryKey: ["featured", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    let newPosts = [];
    let index = 0;

    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...allPosts.slice(index, index + batchSize)];
      setDisplayedPosts([...newPosts]);
      index += batchSize;
    };

    if (featuredPosts.length > 0) {
      // If featured posts are available, handle them separately
      setDisplayedPosts([...featuredPosts.slice(0, 2)]); // Show only 2 on small screens
      loadNextBatch(4);
      loadNextBatch(4);
      while (index < allPosts.length) {
        loadNextBatch(8);
      }
    } else {
      // If no featured posts, load all posts normally
      loadNextBatch(4);
      loadNextBatch(4);
      loadNextBatch(4);
      while (index < allPosts.length) {
        loadNextBatch(8);
      }
    }
    
  
  }, [allPosts, featuredPosts]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // 3-second delay

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
          <p className="mb-2">No listing found</p>
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
    <>
    

      
    

    <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
    {displayedPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
    </div>


  
    </>
  );
};

export default PostList;



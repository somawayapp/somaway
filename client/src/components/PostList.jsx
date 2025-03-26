import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    if (allPosts.length === 0) return;

    let newPosts = [];
    let index = 0;

    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...allPosts.slice(index, index + batchSize)];
      setDisplayedPosts([...newPosts]);
      index += batchSize;
    };

    loadNextBatch(1); // First batch of 1
    setTimeout(() => loadNextBatch(2), 500);
    setTimeout(() => loadNextBatch(3), 1000);
    setTimeout(() => {
      while (index < allPosts.length) {
        loadNextBatch(8);
      }
    }, 1500);
  }, [allPosts]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;
  

  if (displayedPosts.length === 0) {
    return (
      <div className="flex flex-col  items-center justify-center h-[100vh]">
        <p className="mb-4 text-[var(--softTextColor)]">No posts found</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2  rounded-xl border border-[var(--softBg4)] text-[var(--softTextColor)] hover-shadow-md"
        >
          Go Back Home
        </button>
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

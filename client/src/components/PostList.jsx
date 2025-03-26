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

  return (
    <div className="gap-2 grid grid-cols-1  md:gap-4 lg:col-6 scrollbar-hide">
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

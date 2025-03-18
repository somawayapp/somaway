import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ExploreItem from "./ExploreItem";
import React, { useRef, useState, useEffect } from "react";

const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?limit=4&sort=popular`, {
    params: { limit: 4, ...searchParamsObj }, // Limit set to 4 posts
  });
  return res.data;
};

const ExplorePosts = () => {
  const [searchParams] = useSearchParams();
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (direction === "left") {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    setShowLeftButton(scrollLeft > 0);

    if (scrollWidth > clientWidth) {
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    } else {
      setShowRightButton(true);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = containerRef.current;
    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const { data, error, status } = useQuery({
    queryKey: ["posts", "popular", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const posts = data && data.posts ? data.posts : []; // Ensure `data.posts` is available

  return (
    <div className="relative">
      {/* Categories Container */}
      <div
        ref={containerRef}
        className="flex scrollbar-hide overflow-x-auto"
        style={{ whiteSpace: "nowrap" }}
      >
        <div className="flex flex-col overflow-hidden break-words gap-1 md:gap-2 scrollbar-hide">
          {posts.length > 0 ? (
            posts.map((post) => <ExploreItem key={post._id} post={post} />)
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePosts;

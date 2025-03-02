import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import PopularItem from "./PopularItem";
import React, { useRef, useState, useEffect } from "react";

const fetchPosts = async ({ pageParam = 1, searchParams }) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 30, sort: "popular", ...searchParamsObj },
  });
  return res.data;
};

const PopularPosts = () => {
  const [searchParams] = useSearchParams();
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScrollPosition();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "popular", searchParams.toString()],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, searchParams }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage?.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <div className="relative">
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-5 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&lt;</span>
        </button>
      )}
      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-50 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&gt;</span>
        </button>
      )}

      <div ref={containerRef} className="flex scrollbar-hide overflow-x-auto" style={{ whiteSpace: "nowrap" }}>
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<h4>Loading more posts...</h4>}
          className="flex gap-3 md:gap-4 scrollbar-hide"
        >
          {allPosts.length > 0 ? (
            allPosts.map((post) => <PopularItem key={post._id} post={post} />)
          ) : (
            <p>No posts found</p>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PopularPosts;

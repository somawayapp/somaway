import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import FeaturedItem from "./FeaturedItem";
import React, { useRef, useState, useEffect } from "react";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=20&sort=newest`,
    {
      params: { page: pageParam, limit: 30, ...searchParamsObj },
    }
  );
  return res.data;
};

const FeaturedPosts = ({ setOpen }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollWidth > container.clientWidth + container.scrollLeft
      );
    }
  };

  useEffect(() => {
    const container = containerRef.current;
  
    const updateScroll = () => {
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollWidth > container.clientWidth + container.scrollLeft
        );
      }
    };
  
    // Update buttons after rendering posts
    if (data) {
      const timeout = setTimeout(updateScroll, 0); // Delay to ensure layout is updated
      return () => clearTimeout(timeout);
    }
  
    if (container) {
      container.addEventListener("scroll", updateScroll);
      window.addEventListener("resize", updateScroll);
    }
  
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScroll);
      }
      window.removeEventListener("resize", updateScroll);
    };
  }, [data]); // Re-run when `data` (posts) changes
  
  

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (direction === "left") {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "newest", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-5 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&lt;</span>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-50 
          rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&gt;</span>
        </button>
      )}

      {/* Categories Container */}
      <div
        ref={containerRef}
        className="flex scrollbar-hide overflow-x-auto"
        style={{ whiteSpace: "nowrap" }}
      >
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<h4>Loading more posts...</h4>}
          className="flex gap-2 md:gap-4 scrollbar-hide"
        >
          {allPosts.length > 0 ? (
            allPosts.map((post) => <FeaturedItem key={post._id} post={post} />)
          ) : (
            <p>No posts found.</p>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default FeaturedPosts;



    import { useInfiniteQuery } from "@tanstack/react-query";
    import axios from "axios";
    import InfiniteScroll from "react-infinite-scroll-component";
    import { useSearchParams } from "react-router-dom";
    import FeaturedItem from "./FeaturedItem";
    import React, { useRef } from "react";

    
    
    const fetchPosts = async (pageParam, searchParams) => {
        const searchParamsObj = Object.fromEntries([...searchParams]);
      
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=20&sort=newest`, {
          params: { page: pageParam, limit: 30, ...searchParamsObj }, // Changed limit to 30
        });
        return res.data;
      };
      
    
    

      const FeaturedPosts = ({ setOpen }) => {
        const containerRef = useRef(null);
      
        const scroll = (direction) => {
          const scrollAmount = 200; // Adjust this value based on how much you want to scroll
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
        queryKey: ["posts", "newest", searchParams.toString()], // Add "popular" to the queryKey
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) =>
          lastPage.hasMore ? pages.length + 1 : undefined,
        staleTime: 1000 * 60 * 10, // Data stays fresh for 10 minutes
        cacheTime: 1000 * 60 * 30, // Cache remains available for 30 minutes
      });
      if (status === "loading") return <p>Loading...</p>; // Show a loading spinner or message
      if (error) return <p>Something went wrong!</p>; // Handle errors gracefully
      
      const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
      
      return (
        <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1  transform bg-[var(--shadow-color)] bg-opacity-5 rounded-full  py-2 px-4 z-10"
          style={{ border: "none" }}
        >
  <span className="text-white font-bold">&lt;</span>
  </button>
  
  
  
  
     <button
    onClick={() => scroll("right")}
    className="absolute right-1  transform bg-[var(--shadow-color)]  bg-opacity-50 rounded-full py-2 px-4 z-10"
    style={{ border: "none" }}
  >
    <span className="text-white font-bold"> &gt; </span> {/* Using &gt; for greater-than sign */}
  </button>
    {/* Categories Container */}
    <div
        ref={containerRef}
        className="flex overflow-x-auto "
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
    


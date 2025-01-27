import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ExploreItem from "./ExploreItem";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/limit=4&sort=trending`,
    {
      params: { page: pageParam, limit: 4, ...searchParamsObj },
    }
  );
  return res.data;
};

const ExplorePosts = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "trending", searchParams.toString()],
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
      {/* Posts Container */}
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading more posts...</h4>}
        className="flex flex-col gap-4" // Vertical layout
      >
        {allPosts.length > 0 ? (
          allPosts.map((post) => <ExploreItem key={post._id} post={post} />)
        ) : (
          <p>No posts available</p>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default ExplorePosts;

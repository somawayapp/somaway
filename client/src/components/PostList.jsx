import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import SpinnerMini from "./Loader";
import { useEffect } from "react";

const fetchPosts = async (pageParam, searchParams, limit) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) =>
      fetchPosts(pageParam, searchParams, pageParam === 1 ? 10 : 10), // 10 initially, then 10 per scroll
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  // Preload the next set of posts in advance
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      setTimeout(fetchNextPage, 500); // Load next set before user reaches bottom
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-40">
        <SpinnerMini />
      </div>
    );
  }

  if (error) return <p>Something went wrong!</p>;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="flex justify-center mt-6">
          <SpinnerMini />
        </div>
      }
      className="gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-7 scrollbar-hide"
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;

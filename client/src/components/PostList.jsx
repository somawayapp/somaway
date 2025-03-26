import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams, useNavigate } from "react-router-dom";
import SpinnerMini from "./Loader";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";


const fetchPosts = async (pageParam, searchParams, limit) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isPending,  } = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchPosts(),
  });


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
      fetchPosts(pageParam, searchParams, pageParam === 1 ? 2 : 8), // 8 first, 12 per scroll
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  // Preload the next set before user reaches the bottom
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      setTimeout(fetchNextPage, 1000); // Load next set early
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
  if (isPending) return <SpinnerMini />;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  if (allPosts.length === 0) {
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
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="flex justify-center mt-6">
          <SpinnerMini />
        </div>
      }
      className="gap-3 md:gap-6 grid grid-cols-1 md:grid-cols-4 scrollbar-hide"
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;
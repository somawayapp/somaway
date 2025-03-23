import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import SpinnerMini from "./Loader";

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
      fetchPosts(pageParam, searchParams, pageParam === 1 ? 3 : 5), // 3 initially, then 5 per scroll
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  if (status === "loading") return <SpinnerMini />;
  if (error) return <p>Something went wrong!</p>;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<SpinnerMini />}
      className="gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-7 scrollbar-hide"
    >
      {allPosts.length > 0 ? (
        allPosts.map((post) => <PostListItem key={post._id} post={post} />)
      ) : (
        <p>No posts available.</p>
      )}
    </InfiniteScroll>
  );
};

export default PostList;

import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";



const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 50, ...searchParamsObj }, // Changed limit to 30
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
    queryKey: ["posts", searchParams.toString()], // Add "popular" to the queryKey
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
 <InfiniteScroll
  dataLength={allPosts.length}
  next={fetchNextPage}
  hasMore={!!hasNextPage}
  loader={<h4>Loading more posts...</h4>}
  className="gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-7  scrollbar-hide"
>
  {allPosts.length > 0 ? (
    allPosts.map((post) => <PostListItem key={post._id} post={post} />)
  ) : (
    <p></p>
  )}
</InfiniteScroll>

);

};

export default PostList;

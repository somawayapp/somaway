import PostListItem from "./PostListItem";
import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SpinnerMini from "./Loader";

const fetchPosts = async (searchParams, limit, offset = 0) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { ...searchParamsObj, limit, offset },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queries = useQueries({
    queries: [
      {
        queryKey: ["posts", "step1", searchParams.toString()],
        queryFn: () => fetchPosts(searchParams, 1, 0), // Fetch first post
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["posts", "step2", searchParams.toString()],
        queryFn: () => fetchPosts(searchParams, 2, 1), // Fetch next two posts
        enabled: false, // Start only after step 1 is done
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["posts", "step3", searchParams.toString()],
        queryFn: () => fetchPosts(searchParams, 3, 3), // Fetch next three posts
        enabled: false, // Start only after step 2 is done
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["posts", "rest", searchParams.toString()],
        queryFn: () => fetchPosts(searchParams, 100, 6), // Fetch the rest
        enabled: false, // Start only after step 3 is done
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [step1, step2, step3, rest] = queries;
  
  // When the first query is done, enable the second
  if (step1.isSuccess && !step2.isFetching) step2.refetch();
  if (step2.isSuccess && !step3.isFetching) step3.refetch();
  if (step3.isSuccess && !rest.isFetching) rest.refetch();

  const allPosts = [
    ...(step1.data?.posts || []),
    ...(step2.data?.posts || []),
    ...(step3.data?.posts || []),
    ...(rest.data?.posts || []),
  ];

  if (step1.isLoading) return <SpinnerMini />;
  if (queries.some((q) => q.isError)) return <p>Something went wrong!</p>;

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 flex flex-col rounded-xl border border-[var(--softBg4)] text-[var(--softTextColor)] hover:shadow-md"
        >
          <p className="mb-4 text-[var(--softTextColor)]">No posts found</p>
          <p className="mb-4 font-semibold text-[var(--softTextColor)]">Go Back Home</p>
        </button>
      </div>
    );
  }

  return (
    <div className="gap-3 md:gap-6 grid grid-cols-1 md:grid-cols-4 scrollbar-hide">
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

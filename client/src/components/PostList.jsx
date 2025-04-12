import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { ...searchParamsObj },
  });
  return res.data.posts;
};

const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumns(
        width > 1400
          ? "repeat(4, 1fr)"
          : width > 1000
          ? "repeat(3, 1fr)"
          : width > 640
          ? "repeat(2, 1fr)"
          : "repeat(1, 1fr)"
      );
    };

    window.addEventListener("resize", updateColumns);
    updateColumns(); // Initial call

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const [searchParams] = useSearchParams();
  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);

  useEffect(() => {
    if (allPosts.length === 0) {
      setFeaturedPosts([]);
      setRandomPosts([]);
      return;
    }

    const featured = allPosts.filter((post) => post.featured);
    const random = allPosts.filter((post) => !post.featured);

    setFeaturedPosts(featured);
    setRandomPosts(random);
  }, [allPosts]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000); // 3-second delay

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (featuredPosts.length === 0 && randomPosts.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <button
          onClick={() => window.location.href = "/addlisting"}
          className="w-full px-6 py-3 rounded-xl border border-[var(--softBg4)] 
                     text-[var(--softTextColor)] shadow-md 
                     hover:text-[var(--textColor)] hover:shadow-xl text-center"
        >
          <p className="mb-2">No listings found</p>
          <p className="mb-2 font-bold">Go back home</p>
        </button>
      </div>
    );
  }

  if (featuredPosts.length === 0 && randomPosts.length === 0) {
    return (
      <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 overflow-y-auto scrollbar-hide" style={{ height: 'calc(100vw * 8)' }}>
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="relative aspect-[3/3] w-full">
            <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
      {/* Show featured posts first */}
      {featuredPosts.length > 0 && (
        <>
          {/* On medium screens and above, show first four featured posts */}
          <div className="hidden md:grid md:grid-cols-4 gap-4">
            {featuredPosts.slice(0, 4).map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </div>

          {/* On small screens, show only two featured posts */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {featuredPosts.slice(0, 2).map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </div>
        </>
      )}

      {/* Show the rest as random posts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {randomPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostList;

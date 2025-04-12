import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Link from "next/link";

const fetchFeaturedPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&sort=random`,
    {
      params: { ...searchParamsObj },
    }
  );
  return res.data.posts || [];
};

const fetchAllPosts = async (searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?sort=random`,
    {
      params: { ...searchParamsObj },
    }
  );
  return res.data.posts || [];
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

  const {
    data: featuredPosts = [],
    error: featuredError,
    status: featuredStatus,
  } = useQuery({
    queryKey: ["featuredPosts", searchParams.toString()],
    queryFn: () => fetchFeaturedPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const {
    data: allPosts = [],
    error: allError,
    status: allStatus,
  } = useQuery({
    queryKey: ["allPosts", searchParams.toString()],
    queryFn: () => fetchAllPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    const featuredLimit = 4;
    const topFeatured = featuredPosts.slice(0, featuredLimit);
    const nonFeatured = allPosts.filter(
      (post) => !featuredPosts.some((fp) => fp._id === post._id)
    );

    const combinedPosts = [...topFeatured, ...nonFeatured];

    if (combinedPosts.length === 0) {
      setDisplayedPosts([]);
      return;
    }

    let newPosts = [];
    let index = 0;

    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...combinedPosts.slice(index, index + batchSize)];
      setDisplayedPosts([...newPosts]);
      index += batchSize;
    };

    loadNextBatch(4);
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < combinedPosts.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [featuredPosts, allPosts]);

  if (featuredStatus === "loading" || allStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (featuredError || allError) {
    return <p>Something went wrong!</p>;
  }

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (displayedPosts.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <button
          onClick={() => (window.location.href = "/addlisting")}
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

  if (displayedPosts.length === 0) {
    return (
      <div
        className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 overflow-y-auto scrollbar-hide"
        style={{ height: "calc(100vw * 8)" }}
      >
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="relative aspect-[3/3] w-full">
              <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

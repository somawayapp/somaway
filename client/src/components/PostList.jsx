import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Utility to convert URLSearchParams to plain object
const parseSearchParams = (searchParams) =>
  searchParams instanceof URLSearchParams
    ? Object.fromEntries([...searchParams])
    : {};

    const fetchPosts = async (searchParams) => {
      const paramsFromURL = parseSearchParams(searchParams);
    
      const params = {
        // listed: if 'listed' is explicitly present in URL, use it; otherwise default to "true"
        listed: paramsFromURL.hasOwnProperty("listed") ? paramsFromURL.listed : "true",
    
        // sort: use from URL or fallback to "random"
        sort: paramsFromURL.sort || "random",
    
        // Include all other query params (e.g., cat, author, search)
        ...paramsFromURL,
      };
    
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        params,
      });
    
      return res.data;
    };
    

  const posts = res.data?.posts;
  console.log("Fetched posts:", posts);
  return Array.isArray(posts) ? posts : [];
};

const fetchFeaturedPosts = async (searchParams) => {
  const params = {
    ...parseSearchParams(searchParams),
    featured: true,
    limit: 4,
    listed: true,
    sort: "random",
  };

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?sort=random`, {
    params,
  });

  const featured = res.data?.posts;
  console.log("Fetched featured posts:", featured);

  // Randomize the featured posts
  if (Array.isArray(featured)) {
    return featured.sort(() => Math.random() - 0.5);
  }

  return [];
};


const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [searchParams] = useSearchParams();
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

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
    updateColumns();
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const {
    data: allPosts = [],
    error: postsError,
    status: postsStatus,
    refetch, // Add the refetch function here
  } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true, // Refetch on window/tab focus
  });

  useEffect(() => {
    // Force refetch when the component is opened (mounted)
    refetch();
  }, [refetch]);

  const {
    data: featuredPosts = [],
    status: featuredStatus,
  } = useQuery({
    queryKey: ["featured", searchParams.toString()],
    queryFn: () => fetchFeaturedPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!Array.isArray(allPosts) || !Array.isArray(featuredPosts)) return;

    if (postsStatus === "success" && featuredStatus === "success") {
      const filteredPosts = allPosts.filter(
        (post) => !featuredPosts.find((f) => f._id === post._id)
      );
      const combined = [...featuredPosts, ...filteredPosts];

      let index = 0;
      let batched = [];

      const loadNextBatch = (batchSize) => {
        batched = [...batched, ...combined.slice(index, index + batchSize)];
        setDisplayedPosts([...batched]);
        index += batchSize;
      };

      loadNextBatch(4);
      setTimeout(() => loadNextBatch(4), 50);
      setTimeout(() => loadNextBatch(4), 100);
      setTimeout(() => {
        while (index < combined.length) {
          loadNextBatch(8);
        }
      }, 150);
    }
  }, [allPosts, featuredPosts, postsStatus, featuredStatus]);

  if (postsStatus === "loading" || featuredStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (postsError) return <p>Something went wrong!</p>;

  if (!Array.isArray(displayedPosts)) {
    return <p>Unexpected error: displayedPosts is not an array</p>;
  }

  if (displayedPosts.length === 0 && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <button
          onClick={() => (window.location.href = "/")}
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
      <div style={{ display: "grid", gridTemplateColumns: columns, width:"100vw"}} className="gap-6 md:gap-9  px-4 md:px-[80px] overflow-y-auto scrollbar-hide">
       {Array(8).fill(0).map((_, index) => (
          <div key={index} className="relative aspect-[3/3] w-full h-full">
            <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: columns }} className="gap-6 md:gap-9 scrollbar-hide">
      {displayedPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;





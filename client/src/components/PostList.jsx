import PostListItem from "./PostListItem";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SpinnerMini from "./Loader";

const fetchPostByIndex = async (searchParams, index) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { ...searchParamsObj, limit: 1, offset: index },
  });
  return res.data.posts?.[0] || null;
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(false);

        let index = 0;
        const newPosts = [];

        while (true) {
          const post = await fetchPostByIndex(searchParams, index);
          if (!post) break; // Stop if no more posts
          
          if (isMounted) {
            newPosts.push(post);
            setPosts([...newPosts]); // Update UI as each post loads
          }

          index++;
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPosts();
    return () => (isMounted = false);
  }, [searchParams]);

  if (error) return <p>Something went wrong!</p>;

  if (loading && posts.length === 0) return <SpinnerMini />;

  if (posts.length === 0) {
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
      {posts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

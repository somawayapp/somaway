import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Search from "./Search2";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=9&sort=newest`
  );
  return res.data;
};

const FeaturedPosts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchPost,
  });

  if (isLoading) return "Loading...";
  if (error) return "Something went wrong! " + error.message;

  const posts = data?.posts;
  if (!posts || posts.length < 9) {
    return null; // Ensure there are enough posts
  }

  return (
    <div className="flex flex-col bg-[var(--textColore)] p-2  md:p-4 mt-0 md:mt-4">
     

      {/* Featured Section Title */}
      <div className="flex gap-5 flex-col ">
        <h3 className="text-2xl md:text-3xl mb-2 md:mb-3 font-bold text-[var(--textColor)]">
          Featured
        </h3>
        <Search/>

      </div>

      {/* Additional Featured Posts */}
      <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
        {posts.slice(0, 8).map((post, index) => (
          <div
            key={index}
            className="flex flex-col  flex-shrink-0 w-[100px] sm:w-[150px] lg:w-[200px]"
          >
            <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
              <Image
                src={post.img}
                className="absolute top-0  left-0 w-full h-full object-cover rounded-md"
              />
            </Link>
          
            <Link
              to={`/posts?category=${post.category}`}
              className="text-[var(--textColor)] mt-1 md:mt-2 text-xs font-semibold"
            >
              {post.category}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;

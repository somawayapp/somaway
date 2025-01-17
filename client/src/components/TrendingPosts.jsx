import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=9&sort=trending     `
  );
  return res.data;
};

const TrendingPosts = () => {
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
    <div className="flex flex-col mt-8 md:mt-12">
    {/* Featured Section Title */}
    <div>
      <h3 className="text-xl md:text-2xl mb-2 md:mb-3 font-bold text-[var(--textColor)]">
        Daily microlearning session
      </h3>
    </div>
  
    {/* Additional Featured Posts */}
    <div className="flex  gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
      {posts.slice(0, 8).map((post, index) => (
        <div
          key={index}
          className="flex flex-col  flex-shrink-0 w-[70px] border border-4 border-blue-500 rounded-2xl p-[1px]  sm:w-[90px] lg:w-[110px]"
        >
          <Link
            to={`/${post.slug}`}
            className="relative w-full"
            style={{ paddingTop: "120%" }} // Adjusted to make it almost square
          >
            <Image
              src={post.img}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
          </Link>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default TrendingPosts;

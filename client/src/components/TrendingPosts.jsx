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
        For You Learning Session
      </h3>
    </div>
  
    {/* Additional Featured Posts */}
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
  {posts.slice(0, 8).map((post, index) => (
    <div
      key={index}
      className="flex flex-col gap-[0.5px] flex-shrink-0 w-[70px] sm:w-[90px] lg:w-[110px]"
    >
      <Link
        to={`/${post.slug}`}
        className="relative w-full"
        style={{ paddingTop: "120%" }} // Adjusted to make it almost square
      >
        <div
          className="absolute top-0 left-0 w-full h-full p-[1px] gap-[0.5px] rounded-2xl bg-blue-700 box-border"
        >
          <Image
            src={post.img}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </Link>
    </div>
  ))}
</div>
</div>
  
  );
};

export default TrendingPosts;

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
    <div className="flex flex-col mt-0 md:mt-4">
   

      {/* Featured Section Title */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-[var(--textColor)]">
        For You Learning Session        </h3>
      
      </div>

      {/* Additional Featured Posts */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {posts.slice(0, 8).map((post, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 flex-shrink-0 w-[60px]  border  border-4 border-blue-700 rounded-3xl sm:w-[80px] lg:w-[100px]"
          >
            <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
              <Image
                src={post.img}
                className="absolute top-0  left-0 w-full h-full object-cover rounded-md"
              />
            </Link>
         
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;

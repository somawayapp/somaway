import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts`
  );
  return res.data;
};

const LatestPosts = () => {
  const { isLoading, error, data } = useQuery({
    queryFn: fetchPost,
  });

  if (isLoading) return "Loading...";
  if (error) return "Something went wrong! " + error.message;

  const posts = data?.posts;
 

  return (
    <div className="flex flex-col mt-8 md:mt-12">
     

      {/* Featured Section Title */}
      <div>
        <h3 className="text-2xl md:text-3xl mb-2 md:mb-3 font-bold text-[var(--textColor)]">
      All books        </h3>
      
      </div>

      {/* Additional Featured Posts */}
      <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
        {posts.map((post) => (
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
              className="text-[var(--textColor)] text-xs font-semibold"
            >
              {post.category}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestPosts;

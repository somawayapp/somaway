import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import AdChanger from "./Adchanger";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=9&sort=newest`
  );
  return res.data;
};

const truncateText = (text, length) =>
  text.length > length ? text.substring(0, length) + "..." : text;

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
    <div className="flex flex-col  gap-6 mt-4">
          <div style={{ height: "70vh" }}  className="flex flex-col lg:flex-row gap-[100px] mt-4">

      {/* Left Section */}
      <div className="lg:w-2/2 flex flex-col items-start gap-4 p-4  rounded-md">
        <h1 className="text-2xl md:text-[60px] lg:text-[60px] font-bold text-[var(--textColor)]">
          #1 most downloaded <span className="text-blue-600">book summary</span> app
        </h1>
        <p className="text-[var(--textColor)]">
          Achieve your goals with Headway by listening and reading the world’s best ideas
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 flex flex-col gap-6">
        {/* First Featured Post */}
        <div className="flex flex-col gap-2">
          <Link to={`/${posts[0].slug}`} className="relative w-full" style={{ paddingTop: '150%' }}>
            <Image
              src={posts[0].img}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
            />
          </Link>
          <div className="mt-2">
            <Link
              to={`/posts?category=${posts[0].category}`}
              className="text-blue-600 text-sm font-semibold uppercase"
            >
              {posts[0].category}
            </Link>
            <h2 className="text-sm font-bold text-[var(--textColor)] mt-1">
              {truncateText(posts[0].title, 75)}
            </h2>
          </div>
        </div>

      </div>
      </div>

      
        {/* Featured Section Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">Featured</h3>
          <p className="text-gray-600">Featured posts for you</p>
        </div>

        {/* Additional Featured Posts */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-4">
          {posts.slice(1, 8).map((post, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: '150%' }}>
                <Image
                  src={post.img}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                />
              </Link>
              <Link
                to={`/posts?category=${post.category}`}
                className="text-[var(--textColor)] text-xs font-semibold "
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




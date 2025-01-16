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
    <div>
      {/* Welcome section and first featured post */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12 mb-12" style={{ height: "70vh" }}>
        {/* Left section */}
        <div className="lg:w-2/3 flex flex-col justify-center items-start text-left px-6 lg:px-12">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-black">#1 most downloaded <span className="text-blue-500">book summary</span> app</h1>
          <p className="text-lg lg:text-xl mb-6 text-gray-700">
            Achieve your goals with Headway by listening and reading the world’s best ideas.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>

        {/* Right section */}
        <div className="lg:w-1/3 flex flex-col gap-4 px-6 lg:px-0">
          {posts[0].img && (
            <div>
              <Link to={`/${posts[0].slug}`} className="relative">
                <div className="relative w-full" style={{ paddingTop: "125%" }}>
                  <Image
                    src={posts[0].img}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              </Link>
              <Link
                to={`/posts?category=${posts[0].category}`}
                className="text-blue-500 font-semibold uppercase text-sm mt-2 block"
              >
                {posts[0].category}
              </Link>
              <Link
                to={`/${posts[0].slug}`}
                className="text-sm font-bold block mt-1 text-gray-800"
              >
                {truncateText(posts[0].title, 130)}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Featured posts section */}
      <div className="px-6 lg:px-12">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-black">Featured</h2>
        <p className="text-gray-600 mb-6">Featured posts for you</p>
      </div>

      {/* Other featured posts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 px-6 lg:px-12">
        {posts.slice(1, 8).map((post, index) => (
          <div key={index} className="relative">
            <Link to={`/${post.slug}`} className="block relative">
              <div className="relative w-full" style={{ paddingTop: "150%" }}>
                <Image
                  src={post.img}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
            </Link>
            <Link
              to={`/posts?category=${post.category}`}
              className="text-sm text-blue-500 font-semibold mt-2 block"
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

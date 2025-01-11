import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

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
    <div className="lg:grid grid-cols-12 gap-6 mt-4">
      {/* First column: First post */}
      <div className="col-span-6 flex flex-col gap-6 relative">
        {posts[0].img && (
          <Link to={`/${posts[0].slug}`} className="relative">
            <div className="relative w-full" style={{ paddingTop: "100%" }}>
              <Image
                src={posts[0].img}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-30" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <Link
                  to={`/posts?category=${posts[0].category}`}
                  className="text-md font-semibold uppercase"
                >
                  {posts[0].category}
                </Link>
                <br />
                <Link
                  to={`/${posts[0].slug}`}
                  className="text-2xl lg:text-4xl font-bold leading-snug mt-2 block"
                >
                  {truncateText(posts[0].title, 130)}
                </Link>
                <br />
                <Link
                  className="text-md text-gray-300"
                  to={`/posts?author=${posts[0].user.username}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {posts[0].user.username} 
                </Link>
                <span className="text-md px-1 text-gray-300">-</span>
                <span className="text-md text-gray-300">
                  {format(posts[0].createdAt)}
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Second column: Posts 1 and 2 */}
      <div className="col-span-3 flex flex-col gap-6">
        {[posts[1], posts[2]].map((post, index) => (
          post && (
            <div key={index} className="w-full relative">
              <Link to={`/${post.slug}`} className="relative">
                <div className="relative w-full" style={{ paddingTop: "100%" }}>
                  <Image
                    src={post.img}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-30" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <Link
                      to={`/posts?category=${post.category}`}
                      className="text-md font-semibold uppercase"
                    >
                      {post.category}
                    </Link>
                    <br />
                    <Link
                      to={`/${post.slug}`}
                      className="text-lg font-bold leading-snug"
                    >
                      {truncateText(post.title, 75)}
                    </Link>
                    <br />
                    <Link
                      className="text-md text-gray-300"
                      to={`/posts?author=${post.user.username}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.user.username}
                    </Link>
                    <span className="text-md px-1 text-gray-300">-</span>
                    <span className="text-md text-gray-300">
                      {format(post.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )
        ))}
      </div>

      {/* Third column: Posts 4 to 8 */}
      <div className="col-span-3 flex flex-col gap-3">
        {posts.slice(4, 9).map((post, index) => (
          post && (
            <div key={index} className="w-full relative">
              <Link to={`/${post.slug}`} className="relative">
                <div className="relative w-full" style={{ paddingTop: "100%" }}>
                 
                  <div className="absolute inset-0 bg-black opacity-30" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <Link
                      to={`/${post.slug}`}
                      className="text-lg font-bold leading-snug"
                    >
                      {truncateText(post.title, 75)}
                    </Link>
                  </div>
                </div>
              </Link>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;

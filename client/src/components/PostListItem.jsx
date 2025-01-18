import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-4 px-6 lg:px-12">
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
      </div>
  );
};

export default PostListItem;

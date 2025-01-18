import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="flex flex-col mt-8 md:mt-12">
    <div className="grid gap-3 md:gap-4 lg:grid-cols-7 sm:grid-cols-2">
        <div
          key={post.slug}
          className="flex flex-col flex-shrink-0 w-full"
        >
          <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
            <Image
              src={post.img}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
            />
          </Link>
          <Link
            to={`/posts?category=${post.category}`}
            className="text-[var(--textColor)] text-xs font-semibold mt-2"
          >
            {post.category}
          </Link>
        </div>
    </div>
  </div>
  
  );
};

export default PostListItem;

import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  // Truncate title based on screen size
  return (
    <div className=" bg-[var(--textColore)] rounded-2xl p-2 md:p-4 mt-0 ">

    <div className="relative">
      <Link to={`/${post.slug}`} className="block relative">
        <div className="relative rounded-md w-full" style={{ paddingTop: "150%" }}>
          <Image
            src={post.img}
            className="absolute top-0 rounded-md left-0 w-full h-full object-cover"
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

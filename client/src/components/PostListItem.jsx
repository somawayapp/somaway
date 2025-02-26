import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  // Truncate title based on screen size
  return (
    <div className=" bg-[var(--textColore)] rounded-xl p-2 md:p-4 mt-0 ">

    <div className="relative">
      <Link to={`/${post.slug}`} className="block relative">
        <div className="relative rounded-xl w-full" style={{ paddingTop: "150%" }}>
          <Image
            src={post.img}
            className="absolute top-0 rounded-lg left-0 w-full h-full object-cover"
          />
        </div>
      </Link>
      <Link
              to={`/discover?category=${post.author}`}
              className="text-[var(--softTextColor)] mt-2 ml-3 capitalize text-xs  font-semibold"
            >
  {post.author.split(" ").slice(0, 12).join(" ")}
  </Link>
    </div>
    </div>

  );
};

export default PostListItem;

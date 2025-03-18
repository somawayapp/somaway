import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  // Truncate title based on screen size
  return (

    <div className="relative  mb-6 md:mb-[30px]">
      <Link to={`/${post.slug}`} className="block mb-2 md:mb-4 relative">
        <div className="relative rounded-xl w-full" style={{ paddingTop: "150%" }}>
          <Image
            src={post.img}
            className="absolute top-0 rounded-lg md:rounded-2xl left-0 w-full h-full object-cover"
          />
        </div>
      </Link>
      <Link
  to={`/discover?author=${post.author}`}
  className="text-[var(--textColor)] mt-3 ml-3 capitalize text-sm md:text-lg "
>
{post.author ? post.author.slice(0, 20) : ""}
</Link>

    </div>

  );
};

export default PostListItem;

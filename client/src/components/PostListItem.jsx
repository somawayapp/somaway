import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <div className="flex-shrink-0 w-60 sm:w-72 lg:w-80">
      <div className="border border-2 border-blue-500 rounded-2xl overflow-hidden">
        <Link to={`/${post.slug}`}>
          <Image
            src={post.img}
            className="w-full h-40 object-cover rounded-t-2xl"
          />
        </Link>
      </div>
      <div className="mt-2">
        <h2 className="text-lg font-bold">{post.title}</h2>
        <p className="text-sm text-gray-500">{format(post.createdAt)}</p>
      </div>
    </div>
  );
};

export default PostListItem;

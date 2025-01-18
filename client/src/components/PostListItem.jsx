import { Link } from "react-router-dom";
import Image from "./Image";

const PostListItem = ({ post }) => {
  return (
    <div className="flex-shrink-0 w-[70px] sm:w-[90px] lg:w-[110px] border border-2 border-blue-500 rounded-2xl p-[1px]">
      <Link
        to={`/${post.slug}`}
        className="relative w-full"
        style={{ paddingTop: "120%" }} // Maintains aspect ratio
      >
        <Image
          src={post.img}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
        />
      </Link>
    </div>
  );
};

export default PostListItem;

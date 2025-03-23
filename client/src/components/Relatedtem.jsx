
import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const RelatedItem = ({ post }) => {
  // Truncate title based on screen size

  return (
  
  
   
      <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
          <div
            className="flex flex-col  flex-shrink-0 w-[100px] w-[122px] md:w-[240px]"
          >
            <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
              <Image
                src={post.img}
                className="absolute top-0  left-0 w-full h-full object-cover rounded-lg"
              />
            </Link>
            <Link
  to={`/discover?author=${post.author}`}
  className="text-[var(--textColor)] mt-2 ml-3 capitalize text-sm md:text-lg "
>
  {post.author
    ? window.innerWidth >= 768
      ? post.author.slice(0, 20)
      : post.author.slice(0, 15)
    : ""}
</Link>


          </div>
      </div>
  );
};

export default RelatedItem;

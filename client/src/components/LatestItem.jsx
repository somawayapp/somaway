
import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const LatestItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="bg-[var(--textColore)]  rounded-2xl p-2 md:p-4 ">
  
  
   
      <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
          <div
            className="flex flex-col  flex-shrink-0 w-[100px] sm:w-[150px] lg:w-[200px]"
          >
            <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
              <Image
                src={post.img}
                className="absolute top-0  left-0 w-full h-full object-cover rounded-lg"
              />
            </Link>
          
            <Link
              to={`/discover?category=${post.author}`}
              className="text-[var(--softTextColor)] mt-2 ml-3 capitalize text-xs  font-semibold"
            >
  {post.author.split(" ").slice(0, 12).join(" ")}
  </Link>
          </div>
      </div>
  </div>
  );
};

export default LatestItem;

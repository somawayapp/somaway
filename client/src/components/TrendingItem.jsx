
import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const TrendingItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="flex flex-col mt-3 md:mt-6">
  
  
    {/* Additional Featured Posts */}
    <div className="flex  gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
      <div
          className="flex flex-col  flex-shrink-0 w-[70px] border border-2 border-[#0062e3]  rounded-2xl p-[1px]  sm:w-[90px] lg:w-[110px]"
        >
          <Link
            to={`/${post.slug}`}
            className="relative w-full"
            style={{ paddingTop: "120%" }} // Adjusted to make it almost square
          >
            <Image
              src={post.img}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
            />
          </Link>
        </div>
    </div>
  </div>
  );
};

export default TrendingItem;

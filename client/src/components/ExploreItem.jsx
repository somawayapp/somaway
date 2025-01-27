


import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const ExploreItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="flex flex-col mt-4 md:mt-6">
  
  
   
      <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
        
          
            <Link
              to={`/discover?category=${post.title}`}
              className="text-[var(--textColor)] ml-2 mt-1 text-xs font-semibold"
            >
              {post.title}
            </Link>
      </div>
  </div>
  );
};

export default ExploreItem;
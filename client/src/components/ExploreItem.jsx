


import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const ExploreItem = ({ post }) => {
  // Truncate title based on screen size

  return (
    <div className="flex flex-col mt-4 md:mt-6">
  
  
   
        
          
            <Link
              to={`/discover?=${post.title}`}
              className="text-[var(--textColor)] ml-2 mt-1 text-xs font-semibold"
            >
              {post.title}
            </Link>
  </div>
  );
};

export default ExploreItem;
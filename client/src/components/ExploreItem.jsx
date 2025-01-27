import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";

const ExploreItem = ({ post }) => {
  return (
    <div className="flex flex-col">
      <Link
        to={`/discover?=${post.title}`}
        className="text-[var(--textColor)] ml-2 font-semibold flex items-center"
      >
        {/* Blue tick icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-blue-500 mr-1"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M20.292 5.292a1 1 0 011.416 1.416l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 15.586l9.292-9.292z"
            clipRule="evenodd"
          />
        </svg>
        {post.title}
      </Link>
    </div>
  );
};

export default ExploreItem;

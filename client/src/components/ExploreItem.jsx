import { Link } from "react-router-dom";

const ExploreItem = ({ post }) => {
  return (
    <div className="flex flex-col">
      <Link
        to={`/=${post.slug}`}
        className="text-[var(--textColor)] ml-2 flex items-center break-words overflow-hidden"
      >
        {/* Blue tick icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-5 text-blue-700 mr-1"
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

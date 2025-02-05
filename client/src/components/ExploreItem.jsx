import { Link } from "react-router-dom";

const ExploreItem = ({ post }) => {
  return (
    <div className="flex flex-col">
      <Link
        to={`/=${post.slug}`}
        className="text-[var(--textColor)]  flex items-start break-words overflow-hidden"
        style={{
          wordWrap: "break-word", // Ensures words break to the next line if needed
          whiteSpace: "normal",   // Allows wrapping instead of keeping all text in one line
        }}
      >
        {/* Blue tick icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-5 text-[#01274f]    mr-1 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M20.292 5.292a1 1 0 011.416 1.416l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 15.586l9.292-9.292z"
            clipRule="evenodd"
          />
        </svg>
        <span
          className="pl-2" // Indent wrapped lines to align properly
          style={{
            display: "inline-block", // Keeps the alignment consistent
          }}
        >
          {post.title}
        </span>
      </Link>
    </div>
  );
};

export default ExploreItem;

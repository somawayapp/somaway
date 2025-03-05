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
  className="h-7 w-7 text-[#007aff] mr-1 flex-shrink-0"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path
    d="M5 12.5l4.5 4.5L19 7"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
</svg>

        <span
          className="pl-2 text-[16px] md:text-[20px] " // Indent wrapped lines to align properly
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

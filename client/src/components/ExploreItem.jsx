import { Link } from "react-router-dom";

const ExploreItem = ({ post }) => {
  return (
    <div className="flex flex-col">
<Link
  to={`/=${post.slug}`}
  className="text-[var(--textColor)] flex items-start break-words overflow-hidden"
  style={{
    wordWrap: "break-word",
    whiteSpace: "normal",
    display: "flex", // Ensures consistent alignment
    alignItems: "center", // Keeps the icon aligned with text
    gap: "8px", // Adds spacing between the icon and text
  }}
>
  {/* Blue tick icon */}
  <svg width="24px" height="24px" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      fillRule="evenodd" 
      clipRule="evenodd"
      d="M20.53 3.152a1 1 0 0 1 .318 1.378l-10 16a1 1 0 0 1-1.616.11l-5-6a1 1 0 0 1 1.536-1.28l4.116 4.939L19.152 3.47a1 1 0 0 1 1.378-.318Z" 
      fill="#06F">
    </path>
  </svg>

  <span
    className="text-[16px] md:text-[20px] leading-tight"
    style={{
      display: "block", // Ensures the whole span behaves like a block
    }}
  >
    {post.title}
  </span>
</Link>

    </div>
  );
};

export default ExploreItem;

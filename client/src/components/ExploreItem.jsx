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
        <svg width="24px" height="24px" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd"
         d="M20.53 3.152a1 1 0 0 1 .318 1.378l-10 16a1 1 0 0 1-1.616.11l-5-6a1 1 0 0 1 1.536-1.28l4.116 4.939L19.152 3.47a1 1 0 0 1 1.378-.318Z" 
         fill="#06F"></path></svg>

  
     
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

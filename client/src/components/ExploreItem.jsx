import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Using Lucide icon library

const ExploreItem = ({ post }) => {
  return (
    <div className="flex items-center mt-3 md:mt-6">
      <CheckCircle className="text-blue-700 w-4 h-4 mr-2" /> {/* Blue tick icon */}
      <Link
        to={`/${post.slug}`}
        className="text-sm md:text-base font-medium hover:underline"
      >
        {post.title}
      </Link>
    </div>
  );
};

export default ExploreItem;

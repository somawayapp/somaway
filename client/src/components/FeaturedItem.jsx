
import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import Search from "./Search2";

  // Truncate title based on screen size
const FeaturedItem = ({ setOpen }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 200; // Adjust this value based on how much you want to scroll
    if (direction === "left") {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-1  transform bg-[var(--shadow-color)] bg-opacity-5 rounded-full  py-2 px-4 z-10"
        style={{ border: "none" }}
      >
<span className="text-white font-bold">&lt;</span>
</button>




   <button
  onClick={() => scroll("right")}
  className="absolute right-1  transform bg-[var(--shadow-color)]  bg-opacity-50 rounded-full py-2 px-4 z-10"
  style={{ border: "none" }}
>
  <span className="text-white font-bold"> &gt; </span> {/* Using &gt; for greater-than sign */}
</button>


      {/* Categories Container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto mb-5 scrollbar-hide"
        style={{ whiteSpace: "nowrap" }}
      >


          <div
            className="flex flex-col  flex-shrink-0 w-[100px] sm:w-[150px] lg:w-[200px]"
          >
            <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: "150%" }}>
              <Image
                src={post.img}
                className="absolute top-0  left-0 w-full h-full object-cover rounded-xl"
              />
            </Link>
          
            <Link
              to={`/posts?category=${post.category}`}
              className="text-[var(--softTextColor)] mt-1 md:mt-2 text-sm md:text-md font-semibold"
            >
              {post.category}
            </Link>
          </div>
          </div>
          </div>

  );
};

export default FeaturedItem;


import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PostListItem = ({ post }) => {
  const images = post.img || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation(); // Prevent Link click
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation(); // Prevent Link click
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group mb-6 md:mb-[30px] overflow-hidden rounded-xl">
      {/* Image with Link */}
      <Link to={`/${post.slug}`} className="block">
        <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden">
          <img
            src={images[currentIndex]}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-xl md:rounded-2xl transition-all duration-300"
          />
        </div>
      </Link>

      {/* Navigation Arrows (outside Link to prevent navigation) */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full bg-white transition-all duration-300 ${
              currentIndex === index ? "w-4 scale-110" : "opacity-50"
            }`}
          ></span>
        ))}
      </div>

      {/* Author */}
      <Link
        to={`/?author=${post.author}`}
        className="text-[var(--textColor)] mt-3 ml-3 capitalize text-sm md:text-lg"
      >
        {post.author ? post.author.slice(0, 20) : ""}
      </Link>
    </div>
  );
};

export default PostListItem;

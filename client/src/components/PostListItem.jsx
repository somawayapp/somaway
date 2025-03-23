import { useState } from "react";
import { Link } from "react-router-dom";
import Image from "./Image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PostListItem = ({ post }) => {
  const images = post.img || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group mb-6 md:mb-[30px] overflow-hidden rounded-xl">
      <Link to={`/${post.slug}`} className="block relative w-full h-0" style={{ paddingTop: "150%" }}>
        <img
          src={images[currentIndex]}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg md:rounded-2xl transition-all duration-300"
        />
        {/* Arrows */}
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
      </Link>
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

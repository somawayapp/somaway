import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LikeButton from "./LikeButton";

const PostListItem = ({ post }) => {
  const images = post.img || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null); // Reference for scrolling container

  const handleNext = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      scrollToImage((currentIndex + 1) % images.length);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      scrollToImage((currentIndex - 1 + images.length) % images.length);
    }
  };

  const scrollToImage = (index) => {
    if (scrollRef.current) {
      const imageWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * imageWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative gap-2 md:gap-4 group mb-3 md:mb-[15px] overflow-hidden rounded-xl">
      <Link to={`/${post.slug}`} className="block">
        <div className="relative w-full h-full aspect-[3/3] rounded-xl overflow-hidden">
          {/* Scrollable Image Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto aspect-[3/3] snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                className="w-full h-full object-cover rounded-xl flex-shrink-0 snap-center"
              />
            ))}
          </div>


          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 px-2 py-1 rounded-full">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-[5px] w-[5px] rounded-full bg-white transition-all duration-300 ${
                    currentIndex === index ? "w-[8px] h-[5px] scale-110" : "opacity-50"
                  }`}
                ></span>
              ))}
            </div>
          )}
        </div>
      </Link>

      
      <div className=" absolute top-3 right-3">

        <LikeButton postId={post._id} />

        </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden md:block absolute left-3 top-[37%] -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="hidden md:block absolute right-3 top-[37%] -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="mt-3 gap-1">
        <Link to={`/${post.slug}`} className="block">
          <p className="text-[var(--softTextColor)] font-semibold capitalize text-[14px] md:text-[15px]"> 
            Nairobi, Kenya
          </p>
          <p className="text-[var(--softTextColor)] capitalize text-[14px] md:text-[15px]">
            {post.bedrooms
              ? `${post.bedrooms} Bedroom`
              : post.rooms
              ? `${post.rooms} Room`
              : post.propertysize
              ? `${post.propertysize} Sq Ft`
              : ""}
            {post.propertytype ? ` ${post.propertytype.slice(0, 20)}` : ""}
            {post.model?.toLowerCase().includes("forrent") ? " for rent " : " for sale"}
          </p>
          <p className="text-[var(--softTextColor)] text-[13px] md:text-[14px]"> 
            +254 {post.phone ? ` ${post.phone}` : ""}
          </p>
          <p className="text-[var(--softTextColor)] font-semibold text-[14px] md:text-[15px]">
            KSh {post.price ? ` ${post.price}` : ""} 
            <span className="font-normal">
              {post.model?.toLowerCase().includes("forrent") ? " /month " : " /sale"}
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReviewPostItem = ({ post }) => {
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
    <div className="relative flex flex-row  bg-[var(--bd)] p-2 md:p-4 rounded-xl  shadow-2xl gap-2 md:gap-4 group mb-6 md:mb-[30px] overflow-hidden">
      {/* Image with Link */}

      <div className="w-1/4">
      <Link to={`/${post.slug}`} className="block">
  <div className="relative w-full h-full aspect-[3/3] rounded-xl  overflow-hidden">
    {/* Scrollable Image Container */}
    <div className="flex overflow-x-auto aspect-[3/3]  snap-x snap-mandatory scroll-smooth scrollbar-hide">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          className="w-full h-full object-cover rounded-xl flex-shrink-0 snap-center"
        />
      ))}
    </div>

    {/* Dots inside the image at the bottom */}
    {images.length > 1 && (
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 px-2 py-1 rounded-full">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-[5px] w-[5px] rounded-full bg-white transition-all duration-300 ${
              currentIndex === index ? "w-[8px] h-[8px] scale-110" : "opacity-50"
            }`}
          ></span>
        ))}
      </div>
    )}
  </div>
</Link>


      {/* Navigation Arrows (outside Link to prevent navigation) */}
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

      </div>



<div className="mt-3 w-3/4 gap-1">


<p

className="text-[var(--softTextColor)]  font-semibold capitalize  text-[14px] md:text-[15px] "
> Nairobi, Kenya

</p>



      <p

  className="text-[var(--softTextColor)]  capitalize   text-[14px] md:text-[15px] "
>
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

<p

className="text-[var(--softTextColor)]     text-[13px] md:text-[14px] "
> +254 

{post.phone ? ` ${post.phone}` : ""}
</p>

<p

className="text-[var(--softTextColor)] font-semibold    text-[14px] md:text-[15px] "
> KSh
{post.price ? ` ${post.price}` : ""} <span className="font-normal">
{post.model?.toLowerCase().includes("forrent") ? " /month " : " /sale"}

</span>
</p>

    </div>
    </div>

  );
};

export default ReviewPostItem;

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReviewPostItem = ({ post }) => {
  const images = Array.isArray(post.img) ? post.img : [];

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
    <div className="relative flex flex-row  bg-[var(--bd)] mb-3 md:mb-[15px] p-3 md:p-6 rounded-xl  shadow-xl  hover:shadow-md gap-2 md:gap-4 group  overflow-hidden">
      {/* Image with Link */}

      <div className="w-1/4">
      <Link to={`/history/${post.slug}`} className="block">
  <div className="relative w-full h-full aspect-[3/3] rounded-xl  overflow-hidden">
    {/* Scrollable Image Container */}
    <div             ref={scrollRef}

     className="flex overflow-x-auto aspect-[3/3]  snap-x snap-mandatory scroll-smooth scrollbar-hide">
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
            className={`h-[3px] w-[3px] rounded-full bg-white transition-all duration-300 ${
              currentIndex === index ? "w-[5px] h-[3px] scale-110" : "opacity-50"
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
      className="hidden md:block absolute left-1 top-[47%] -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
    >
      <ChevronLeft size={10} />
    </button>
    <button
      onClick={handleNext}
      className="hidden md:block absolute right-1 top-[47%] -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
    >
      <ChevronRight size={10} />
    </button>
  </>
)}

      </div>



<div className=" w-3/4 ">
<Link to={`/history/${post.slug}`} className="block">


<p

className="text-[var(--softTextColor)]  font-semibold capitalize mt-2 md:mt-1  text-[14px]  "
> Nairobi, Kenya

</p>

<p

className="text-[var(--softTextColor)]  capitalize   text-[14px] "
> 

{post.propertyname ? ` ${post.propertyname.slice(0, 20)}` : ""} <span>|</span> <span>  {post.propertytype ? ` ${post.propertytype.slice(0, 20)}` : ""}
</span>
</p>

   

<p
className="text-[var(--softTextColor)]     text-[14px]"
>  <span className="font-semibold text-[13px]">34</span> Reviews

{post.reviewslength ? ` ${post.reviewslength}` : ""}
</p>



</Link>
</div>
    </div>

  );
};

export default ReviewPostItem;

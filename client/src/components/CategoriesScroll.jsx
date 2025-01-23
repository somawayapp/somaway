import React, { useRef } from "react";
import { Link } from "react-router-dom";

const categories = [
  "Self-Growth",
  "Business & Career",
  "Fiction",
  "Productivity",
  "Home & Environment",
  "Society & Tech",
  "Health",
  "Family",
  "Sports & Fitness",
  "Personalities",
  "Happiness",
  "Spirituality",
  "Leadership",
  "Love & Sex",
  "Money & Investments",
  "Negotiation",
];

const CategoriesScroll = ({ setOpen }) => {
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
        {categories.map((category) => {
          // Transform category for URL slug
          const slug = category
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/&/g, "-"); // Replace "&" with hyphens

          return (
            <Link
              key={category}
              to={`/posts?cat=${slug}`}
              className="flex items-center justify-center text-[var(--textColor)] text-xs 
              md:text-md bg-[var(--textColore)] hover:bg-[var(--softTextColor7)] rounded-xl px-5 py-2 md:px-7 transition-all"
              onClick={() => setOpen(false)}
            >
              {/* Image for the category */}
              <img
                src={`/${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/&/g, "and")}.webp`}
                alt={category}
                className="w-5 h-5 md:w-8 md:h-8 object-cover rounded-full"
              />
              <span className="text-sm md:text-md">{category}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesScroll;

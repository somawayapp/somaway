import React, { useRef, useState, useEffect } from "react";
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
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scroll = (direction) => {
    const scrollAmount = 200; // Adjust this value based on how much you want to scroll
    if (direction === "left") {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    // Show or hide left button
    setShowLeftButton(scrollLeft > 0);

    // Show or hide right button
    setShowRightButton(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    // Check scroll position initially
    checkScrollPosition();

    // Add scroll event listener to container
    const container = containerRef.current;
    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/3 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-5 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&lt;</span>
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/3 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-50 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&gt;</span>
        </button>
      )}

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
              md:text-md bg-[var(--textColore)] shadow-2xl hover:bg-[var(--softTextColor7)] rounded-xl px-5 py-2 md:px-7 transition-all"
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

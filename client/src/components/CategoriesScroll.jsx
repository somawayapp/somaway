import React from "react";
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
  return (
    <div
      className="flex gap-4 overflow-x-auto mb-5 scrollbar-hide"
      style={{ whiteSpace: "nowrap" }}
    >
      {categories.map((category) => {
        // Transform category for URL slug
        const slug = category
          .toLowerCase()
          .replace(/\s+/g, "") 
          .replace(/&/g, "-");  // Replace "&" with hyphens

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
            src={`/${category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}.webp`}
            alt={category}
            className="w-5 h-5 md:w-8 md:h-8 object-cover rounded-full"
          />
          <span className="text-sm md:text-md">{category}</span>
        </Link>
        
        );
      })}
    </div>
  );
};

export default CategoriesScroll;


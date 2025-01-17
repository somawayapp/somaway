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
      className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2"
      style={{ whiteSpace: "nowrap" }}
    >
      {categories.map((category) => (
        <Link
          key={category}
          to={`/posts?cat=${category.toLowerCase().replace(/\s+/g, "-")}`}
          className="text-[var(--textColor)] bg-[var(--textColore)] hover:bg-[var(--softTextColor7)] rounded-xl px-4 py-2 transition-all"
          onClick={() => setOpen(false)}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesScroll;

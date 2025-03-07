import React from "react";

const Partners = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-white">
      <div className="flex gap-8 animate-scroll">
        <img src="/enterpreneur.svg" className="h-9 md:h-[50px]" />
        <img src="/euronews.svg" className="h-9 md:h-[50px]" />
        <img src="/forbes.svg" className="h-9 md:h-[50px]" />
        <img src="/muo.svg" className="h-9 md:h-[50px]" />
        <img src="/reuters.svg" className="h-9 md:h-[50px]" />
        <img src="/yahoo.svg" className="h-9 md:h-[50px]" />
        {/* Duplicate the logos for seamless scrolling */}
        <img src="/enterpreneur.svg" className="h-9 md:h-[50px]" />
        <img src="/euronews.svg" className="h-9 md:h-[50px]" />
        <img src="/forbes.svg" className="h-9 md:h-[50px]" />
        <img src="/muo.svg" className="h-9 md:h-[50px]" />
        <img src="/reuters.svg" className="h-9 md:h-[50px]" />
        <img src="/yahoo.svg" className="h-9 md:h-[50px]" />
      </div>
    </div>
  );
};

export default Partners;

// Tailwind CSS Styles (Add to your global CSS or tailwind config)
// Add this to your CSS file or global styles
// If using Tailwind, include this in your styles
// @keyframes scroll {
//   from { transform: translateX(0); }
//   to { transform: translateX(-50%); }
// }

// .animate-scroll {
//   display: flex;
//   animation: scroll 20s linear infinite;
// }

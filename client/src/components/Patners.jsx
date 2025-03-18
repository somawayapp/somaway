import React from "react";

const Partners = () => {
  return (
    <div className="overflow-hidden  border-t border-t-[var(--softBg4)] whitespace-nowrap py-4 ">
      <div className="flex  gap-9  md:gap-[80px] animate-scroll">
        <img src="/enterpreneur.svg" className="h-6 md:h-[30px]" />
        <img src="/euronews.svg" className="h-6 md:h-[30px]" />
        <img src="/forbes.svg" className="h-6 md:h-[30px]" />
        <img src="/muo.svg" className="h-6 md:h-[30px]" />
        <img src="/reuters.svg" className="h-6 md:h-[30px]" />
        <img src="/yahoo.svg" className="h-6 md:h-[30px]" />
        {/* Duplicate the logos for seamless scrolling */}
        <img src="/enterpreneur.svg" className="h-6 md:h-[30px]" />
        <img src="/euronews.svg" className="h-6 md:h-[30px]" />
        <img src="/forbes.svg" className="h-6 md:h-[30px]" />
        <img src="/muo.svg" className="h-6 md:h-[30px]" />
        <img src="/reuters.svg" className="h-6 md:h-[30px]" />
        <img src="/yahoo.svg" className="h-6 md:h-[30px]" />
      </div>
    </div>
  );
};

export default Partners;

// Tailwind CSS Styles (Add to your global CSS or tailwind config)
// Add this to your CSS file or global styles
// If using Tailwind, include this in your styles

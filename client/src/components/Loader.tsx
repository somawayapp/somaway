import { BiLoaderAlt } from "react-icons/bi";

import React, { FC } from "react";

interface SpinnerMiniProps {
  className?: string;
}

export const SpinnerMini: React.FC<SpinnerMiniProps> = ({ className }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <BiLoaderAlt className={`w-[50px] h-[50px] text-[#FF5A5F] animate-spin ${className}`} />
    </div>
  );
  };

export default SpinnerMini;

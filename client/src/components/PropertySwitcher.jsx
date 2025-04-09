import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale
  const [toggleModelState, setToggleModelState] = useState(false); // false = forrent, true = forsale

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate("/"); // Always go to home when toggling
  };
  const handleModelToggle = () => {
    const newState = !toggleModelState;
    setToggleModelState(newState);
    navigate(location.pathname + `?model=${newState ? 'forsale' : 'forrent'}`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const isNotRootPath = location.pathname === "";

  const isRootPathWithoutSearchParams = location.pathname === "/" && !location.search;



  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center space-y-4">
        {isNotRootPath && (

        <div className="flex justify-between gap-2 block md:hidden md:gap-4 items-center w-full max-w-sm">
          
          {/* Clickable text */}
          <div onClick={handleGoHome} className="cursor-pointer">
            <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              Remove all filters
            </p>
            <p className="text-sm md:hidden block text-[var(--softTextColor)] font-normal">
              go back home
            </p>
          </div>

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleToggle}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✕" : "✓"}
            </div>
          </div>
        </div>    )}




        <div className="flex justify-between hidden md:flex gap-2 md:gap-4 items-center w-full max-w-sm">
          
          {/* Clickable text */}
          <div onClick={handleGoHome} className="cursor-pointer">
            <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              Remove all filters
            </p>
            <p className="text-sm md:hidden block text-[var(--softTextColor)] font-normal">
              go back home
            </p>
          </div>

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleToggle}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✕" : "✓"}
            </div>
          </div>
        </div>

        {isRootPathWithoutSearchParams && (

        <div className="flex justify-between block md:hidden  gap-2 md:gap-4 items-center w-full max-w-sm">
          
          {/* Clickable text */}
          <div onClick={handleModelToggle} className="cursor-pointer">
            <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              For rent
            </p>
            <p className="text-sm md:hidden block text-[var(--softTextColor)] font-normal">
              For sale
            </p>
          </div>

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleModelToggle}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleModelState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✕" : "✓"}
            </div>
          </div>
        </div> )}

    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale

  // Handle toggling between forrent and forsale
  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate(location.pathname + `?model=${newState ? 'forsale' : 'forrent'}`);
  };

  // Handle the "Remove all filters" button
  const handleGoHome = () => {
    navigate("/");
  };

  // Handle toggling between the models on small screens
  const handleToggleModel = (model) => {
    setToggleState(model === 'forsale');
    navigate(location.pathname + `?model=${model}`);
  };

  // Check if we are on small screens and the URL is exactly '/'
  const isHomePage = location.pathname === '/';
  const isSmallScreen = window.innerWidth < 768;

  const modelFromUrl = new URLSearchParams(location.search).get('model');

  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center space-y-4">
      {/* Extra options shown if not on root path (only on small screens) */}
      {isSmallScreen && isHomePage && (
        <div className="flex justify-between gap-2 md:gap-4 items-center w-full max-w-sm">
          {/* Remove all filters button */}
          <div onClick={handleGoHome} className="cursor-pointer">
            <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              Remove all filters
            </p>
            <p className="text-sm md:hidden block text-[var(--softTextColor)] font-normal">
              Go back home
            </p>
          </div>

          {/* Toggle between forrent and forsale */}
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
      )}

      {/* For Rent or For Sale toggler */}
      {isSmallScreen && isHomePage && (
        <div className="flex justify-between block md:hidden gap-2 md:gap-4 items-center w-full max-w-sm">
          {/* For Rent or For Sale Button */}
          <div onClick={() => handleToggleModel('forrent')} className="cursor-pointer">
            <p className={`text-md ${modelFromUrl === 'forrent' ? 'font-bold' : 'text-[var(--softTextColor)]'} hover:underline`}>
              For rent
            </p>
          </div>

          <div onClick={() => handleToggleModel('forsale')} className="cursor-pointer">
            <p className={`text-md ${modelFromUrl === 'forsale' ? 'font-bold' : 'text-[var(--softTextColor)]'} hover:underline`}>
              For sale
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

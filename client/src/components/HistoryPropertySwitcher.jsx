import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function HistoryPropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale
  const [toggleModelState, setToggleModelState] = useState(false); // UI toggle for root page
  const [searchParams, setSearchParams] = useSearchParams();
  const currentModel = searchParams.get('model'); // Get current model

  const handleClickModel = (model) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('model', model);
    setSearchParams(newParams); // Triggers rerender with updated model param
  };

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate("/history"); // Always go to home when toggling
  };

  const handleGoHome = () => {
    navigate("/history");
  };

  const isNotRootPath = location.pathname === "/history" && location.search !== "";
  const isRootPathWithoutSearchParams = location.pathname === "/history" && !location.search;

  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center">
      {isNotRootPath && (
        <div className="flex justify-between gap-2 block  md:gap-4 items-center w-full max-w-sm">
          {/* Clickable text */}
          <div className="cursor-pointer justify-left ">
            <p
              onClick={handleGoHome}
              className="text-md  cursor-pointer  text-left text-[var(--softTextColor)] font-bold hover:underline"
            >
              Remove all filters
            </p>
          
          </div>

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleGoHome}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
             <div
            className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out ${
              toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"
            }`}
          >
            ✓
          </div>
          </div>
        </div>
      )}

     

      {isRootPathWithoutSearchParams && (
        <div className="flex justify-left  gap-0 md:gap-4 items-center w-full max-w-sm">
          {/* Clickable text */}
          <div>
            <p className="text-md  md:text-3xl text-left text-[var(--softTextColor)] font-bold hover:underline">
             Property history& reviews
            </p>
           
          </div>

        
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate("/"); // Always go to home when toggling
  };

  const handleGoHome = () => {
    navigate("/");
  };

  


  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center space-y-4">
      {/* Extra options shown if not on root path */}
        <div className="flex justify-between gap-2 md:gap-4 items-center w-full max-w-sm">
          
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



        <div className="flex  border p-3 border-[var(--softBg4)] rounded-xl justify-between w-full block md:hidden max-w-sm">
        <a
          href="?model=forrent"
          className="text-md font-bold text-[var(--softTextColor)] hover:underline"
        >
          For Rent
        </a>
        <a
          href="?model=forsale"
          className="text-md font-bold text-[var(--softTextColor)] hover:underline"
        >
          For Sale
        </a>
      </div>
    </div>
  );
}

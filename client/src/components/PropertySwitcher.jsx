import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale

  useEffect(() => {
    const isHomePage = location.pathname === "/" && location.search === "";
    setShowExtraOptions(!isHomePage);
  }, [location]);

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate(`?model=${newState ? "forsale" : "forrent"}`);
  };

  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center space-y-4">
      {/* Top switcher */}
    
      {/* Extra options shown if not on root path */}
      {showExtraOptions && (
        <div className="flex justify-between  gap-2 md:gap-4 items-center w-full max-w-sm ">
            <div>
            <p className="text-md text-[var(--softTextColor)] font-bold cursor-pointer hover:underline">
            Remove all filters
          </p>
          <p className="text-sm text-[var(--softTextColor)] font-normal ">
            go back home
          </p>
            </div>
         

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleToggle}
            className= "w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-30 bg-[var(--softTextColor)]" >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✕" : "✓"}
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

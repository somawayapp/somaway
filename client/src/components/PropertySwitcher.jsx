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
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Top switcher */}
      <div className="flex justify-between w-full max-w-sm">
        <a
          href="?model=forrent"
          className="text-[16px] font-normal text-[var(--softTextColor)] hover:underline"
        >
          For Rent
        </a>
        <a
          href="?model=forsale"
          className="text-[16px] font-normal text-[var(--softTextColor)] hover:underline"
        >
          For Sale
        </a>
      </div>

      {/* Extra options shown if not on root path */}
      {showExtraOptions && (
        <div className="flex justify-between items-center w-full max-w-sm mt-2">
          <span className="text-sm text-gray-500 cursor-pointer hover:underline">
            Remove all filters
          </span>
          <button
            onClick={handleToggle}
            className="px-4 py-2 bg-gray-200 text-sm rounded-full hover:bg-gray-300 transition"
          >
            Toggle to {toggleState ? "For Rent" : "For Sale"}
          </button>
        </div>
      )}
    </div>
  );
}


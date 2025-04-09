import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const model = queryParams.get("model");

    // Set toggleState based on the current model in the URL
    if (model === "forsale") {
      setToggleState(true);
    } else {
      setToggleState(false);
    }
  }, [location]);

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    const model = newState ? "forsale" : "forrent";
    navigate(`/?model=${model}`); // Update the URL with the new model
  };

  const handleGoHome = () => {
    navigate("/"); // Go back to home
  };

  const isHomePage = location.pathname === "/";

  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center space-y-4">
      {/* Extra options shown only if on the homepage and on small screens */}
      {isHomePage && (
        <div className="flex justify-between gap-2 md:gap-4 items-center w-full max-w-sm">
          {/* Clickable text to remove all filters */}
          <div onClick={handleGoHome} className="cursor-pointer md:hidden">
            <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              Remove all filters
            </p>
            <p className="text-sm md:hidden block text-[var(--softTextColor)] font-normal">
              go back home
            </p>
          </div>

          {/* Toggle switch */}
          <div
            onClick={handleToggle}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out ${
                toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"
              }`}
            >
              {toggleState ? "✕" : "✓"}
            </div>
          </div>
        </div>
      )}

      {/* For Rent or For Sale toggle, only shown on homepage */}
      {isHomePage && (
        <div className="flex justify-between block md:hidden gap-2 md:gap-4 items-center w-full max-w-sm">
          {/* For Rent / For Sale toggle */}
          <div
            onClick={handleToggle}
            className="cursor-pointer md:hidden"
          >
            <p className={`text-md text-[var(--softTextColor)] font-bold hover:underline ${!toggleState ? 'font-bold' : ''}`}>
              For rent
            </p>
            <p className={`text-sm md:hidden block text-[var(--softTextColor)] font-normal ${toggleState ? 'font-bold' : ''}`}>
              For sale
            </p>
          </div>

          {/* Toggle switch */}
          <div
            onClick={handleToggle}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out ${
                toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"
              }`}
            >
              {toggleState ? "✕" : "✓"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

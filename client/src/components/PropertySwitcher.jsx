import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

function useIsMdOrLarger() {
  const [isMdOrLarger, setIsMdOrLarger] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMdOrLarger(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMdOrLarger;
}

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale
  const [searchParams, setSearchParams] = useSearchParams();
  const currentModel = searchParams.get('model'); // Get current model
  const [showDropdown, setShowDropdown] = useState(true); // NEW: for dropdown toggle
  const isMdOrLarger = useIsMdOrLarger();


  const handleClickFilter = (listedValue) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('listed', listedValue); // 'true' or 'false'
    setSearchParams(newParams);
  };
  

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const removeParam = (key) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllParams = () => {
    setSearchParams({});
  };

  const isNotRootPath = location.pathname === "/" && location.search !== "";
  const isRootPathWithoutSearchParams = location.pathname === "/" && !location.search;

  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 md:mb-3 shadow-md flex flex-col items-center relative">
      {/* Dropdown with Active Search Params */}
      {location.search && (
        <div className="w-full mb-3">
         <div className=" flex gap-6 mt-1 justify-between">
         <button
        className="text-sm ml-1 text-[var(--softTextColor)] transition-transform duration-200 hover:scale-105 underline font-semibold flex items-center gap-2"
         onClick={() => setShowDropdown((prev) => !prev)}>
         {showDropdown ? "Hide Filters" : "Show Active Filters"}
        </button>

        <SlidersHorizontal      onClick={() => setShowDropdown((prev) => !prev)}  className="w-8 h-4 font-semibold cursor-pointer transition-transform duration-200 hover:scale-105 text-[var(--textColor)]" />


         </div>


         {showDropdown && (
  isMdOrLarger ? (
    // Modal
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-[var(--bg)] border border-[var(--softBg4)] rounded-md shadow-lg p-5 w-full max-w-md text-sm space-y-2 relative">
        <button
          onClick={() => setShowDropdown(false)}
          className="absolute top-2 right-2 text-[var(--softTextColor)] hover:text-red-500 text-xs"
        >
          Close ✕
        </button>
        {[...searchParams.entries()].map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-[var(--softTextColor)]">
              {key}: <span className="font-semibold">{value}</span>
            </span>
            <button
              className="text-blue-500 ml-1 text-xs hover:underline"
              onClick={() => removeParam(key)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={clearAllParams}
          className="mt-2 text-blue-600 text-xs font-bold hover:underline"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  ) : (
    // Existing Dropdown
    <div className="mt-2 bg-[var(--bg)] border border-[var(--softBg4)] rounded-md shadow-md p-3 text-sm space-y-2">
      {[...searchParams.entries()].map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <span className="text-[var(--softTextColor)]">
            {key}: <span className="font-semibold">{value}</span>
          </span>
          <button
            className="text-blue-500 ml-1 text-xs hover:underline"
            onClick={() => removeParam(key)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={clearAllParams}
        className="mt-2 text-blue-600 text-xs font-bold hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  )
)}

        </div>
      )}

   

      {/* UI if no search params */}
   {isRootPathWithoutSearchParams && (
    <div className="w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between gap-4 items-center w-full">
          <p
            onClick={() => handleClickFilter("")}
            className={`text-sm text-[var(--softTextColor)] hover:underline ${
              searchParams.toString() === "" ? "font-bold underline" : ""
            }`}
          >
            Property Reviews & History
          </p>
          <SlidersHorizontal
            onClick={() => setShowDropdown((prev) => !prev)}
            className="w-5 h-5 cursor-pointer transition-transform duration-200 hover:scale-105 text-[var(--textColor)]"
          />
        </div>
  
        <p
          onClick={() => handleClickFilter("true")}
          className={`text-sm text-[var(--softTextColor)] cursor-pointer hover:underline ${
            searchParams.get("listed") === "true" ? "font-bold underline" : ""
          }`}
        >
          Go to Vacant Homes
        </p>
      </div>
    </div>
  )}
  
    </div>
  );
}

import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const useScrollDirection = () => {
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const lastScrollTop = useRef(0);

  const location = useLocation(); // Get the current path

  useEffect(() => {
    // If the path is not "/", set isScrolledUp to true
    if (location.pathname !== "/") {
      setIsScrolledUp(true);
      return;
    }
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (lastScrollTop.current < scrollTop && scrollTop >= 0 && scrollTop <= 30) {
        // Scrolling down between 0 to 10px
        setIsScrolledUp(true);
      } 
      else if (lastScrollTop.current > scrollTop && scrollTop >= 50 && scrollTop <= 80) {
        // Scrolling up between 15 to 25px
        setIsScrolledUp(false);
      }

      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isScrolledUp;
};





const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const isScrolledUp = useScrollDirection(10); // Using debounced scroll


  const [filters, setFilters] = useState({
    location: "",
    propertytype: "",
    bedrooms: "",
    bathrooms: "",
    propertysize: "",
    rooms: "",
    pricemin: "",
    pricemax: "",
    model: "",
  });



  
  

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const filteredParams = Object.entries(filters)
        .filter(([_, value]) => value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      setSearchParams({
        ...Object.fromEntries(searchParams),
        ...filteredParams,
      });
      setIsOpen(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return(
    <>
    <div
    className="top-0 w-full md:px-6 z-50 hidden md:flex mt-[-90px] flex-col items-center justify-center transition-all duration-300"
      >
        {/* Rent & Sale Links */}
        {!isScrolledUp && (
  
        <div
          className={`flex justify-center gap-[60px] transition-all duration-300 ${
            isScrolledUp ? "opacity-0 translate-y-[-20px] mb-0  pointer-events-none" : " mb-6 mt-[35px] opacity-100 translate-y-0"
          }`}
        >
          <a href="?model=forrent" className="text-sm font-semibold  text-[var(--softTextColor)] hover:underline">
         For Rent
          </a>
   
          <a href="?model=forsale" className="text-sm font-normal text-[var(--softTextColor)] hover:underline">
          For Sale
          </a>
        </div> )}
  
  
  
  
      {/* search button for md screens */}
  
      <button
    onClick={() => setIsOpen(true)}
    type="button"
    className={`border-[1px] border-[var(--softBg4)] max-w-[1100px] w-full mx-auto rounded-full shadow-md transition duration-300 cursor-pointer  ${
        isScrolledUp ? " mt-6 mb-0" : " mt-0 mb-4"
      } `}
    >
    <div className="flex flex-row  items-center relative gap-2 justify-between">
      {/* Location */}
      <div
        className={`relative hover:bg-[var(--softBg4)] rounded-full group p-2 ${
          isScrolledUp ? "md:px-4" : "md:px-8"
        } flex flex-col items-start text-left flex-1`}
      >
        <small className="text-[12px] md:text-[13px] ml-4 font-semibold text-[var(--softTextColor)] transition">
          {filters.location || "Anywhere"}
        </small>
        {!isScrolledUp && (
          <span className="hidden md:block text-[14px] ml-4 text-[var(--softBg5)]" style={{ whiteSpace: 'nowrap' }}>
            Search by location
          </span>
        )}
      </div>
  
      <div className={`h-[30px] ${isScrolledUp ? "md:h-[30px]" : "md:h-[40px]"} border-l-[1px] border-[var(--softBg4)]`}></div>
  
      {/* Property Size */}
      <div
        className={`relative hover:bg-[var(--softBg4)] rounded-full group p-2 ${
          isScrolledUp ? "md:px-4" : "md:px-8"
        } flex flex-col items-start text-left flex-1`}
      >
        <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition"   style={{ whiteSpace: 'nowrap' }}>
          {filters.propertysize || "Any size"}
        </small>
        {!isScrolledUp && (
          <span className="hidden md:block text-[14px] text-[var(--softBg5)] " style={{ whiteSpace: 'nowrap' }}>
            Filter by size
          </span>
        )}
      </div>
  
      <div className={`hidden md:block h-[30px] ${isScrolledUp ? "md:h-[30px]" : "md:h-[40px]"} border-l-[1px] border-[var(--softBg4)]`}></div>
  
      {/* Price */}
      <div
        className={`relative hidden md:block hover:bg-[var(--softBg4)] rounded-full group p-2 ${
          isScrolledUp ? "md:px-4" : "md:px-8"
        } flex flex-col items-start text-left flex-1`}
      >
  
        <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition"   style={{ whiteSpace: 'nowrap' }}>
          {filters.pricemin || filters.pricemax ? (
            <>
              {filters.pricemin ? `KSh ${filters.pricemin}` : "KSh 0"} -{" "}
              {filters.pricemax ? `KSh ${filters.pricemax}` : "KSh 0"}
            </>
          ) : (
            "Any price"
          )}
        </small> 
        {!isScrolledUp && (
          <span className="hidden md:block text-[14px] text-[var(--softBg5)]" style={{ whiteSpace: 'nowrap' }}>
            Filter by price
          </span>
        )}
      </div>
  
      {!isScrolledUp && (
  
      <div className={`hidden md:block h-[30px] ${isScrolledUp ? "md:h-[30px]" : "md:h-[40px]"} border-l-[1px] border-[var(--softBg4)]`}></div>
  
      )}
  
      {/* Property Type */}
      {!isScrolledUp && (
  
      <div
        className={`relative hidden md:block hover:bg-[var(--softBg4)] rounded-full group p-2 ${
          isScrolledUp ? "md:px-4" : "md:px-8"
        } flex flex-col items-start text-left flex-1`}
      >
        <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition"   style={{ whiteSpace: 'nowrap' }}>
          {filters.propertytype || "Any type"}
        </small>
        {!isScrolledUp && (
          <span className="hidden md:block text-[14px] text-[var(--softBg5)]" style={{ whiteSpace: 'nowrap' }}>
            Filter by type
          </span>
        )}
      </div> )}
  
      {/* Search Icon */}
      <div className="p-2">
        <div
          className={`bg-[#2F74FD] rounded-full text-white transition-transform duration-300 hover:scale-110 hover:bg-[#0556f7] ${
            isScrolledUp ? "p-3" : "p-4"
          }`}
        >
          <FaSearch className={`text-[12px]`} />
        </div>
      </div>
    </div>
  </button>
  
  
      </div>
  
  
  
  
  
      {/* search button for small screens */}
  
  
      <button
  onClick={() => setIsOpen(true)}
  style={{ zIndex: 100010 }}
  type="button"
  className="w-full block md:hidden border-[1px] border-[var(--softBg4)] rounded-full shadow-md transition
   duration-300 cursor-pointer"
>
  <div className="flex flex-row items-center relative gap-2 w-full justify-between">
    {/* Location */}
    <div className="relative hover:bg-[var(--softBg4)] rounded-full group p-2 flex flex-col items-start text-left flex-1">
      <small className="text-[12px] ml-4 font-semibold text-[var(--softTextColor)] transition">
        {filters.location || "Anywhere"}
      </small>
    </div>

    <div className="h-[30px] border-l-[1px] border-[var(--softBg4)]"></div>

    {/* Property Size */}
    <div className="relative hover:bg-[var(--softBg4)] rounded-full group p-2 flex flex-col items-start text-left flex-1">
      <small className="text-[12px] font-semibold text-[var(--softTextColor)] transition">
        {filters.propertytype || "Any type"}
      </small>
    </div>

    {/* Search Icon */}
    <div className="p-2 flex-shrink-0">
      <div className="p-3 bg-[#2F74FD] rounded-full text-white transition-transform duration-300 hover:scale-110 hover:bg-[#0556f7]]">
        <FaSearch className="text-[12px]" />
      </div>
    </div>
  </div>
</button>

  
  
  
        {isOpen && (
          <div
           id="popup-overlay"
            onClick={handleOutsideClick}
            style={{ zIndex: 100014 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
          <div className="p-3"> 
  
            <div className="bg-[var(--bg)] p-5 md:p-9 rounded-lg border-[0.5px]  border-[var(--softBg4)] shadow-lg 
             min-h-[50vh] flex flex-col justify-between">
          
            <div className="flex items-center justify-center relative">
            <p className="text-lg text-[var(--softtextColor)] text-center">Filters</p>
            <button
            className="absolute right-0 text-[var(--softTextColor)] hover:text-[var(--softerTextColor)] flex items-center"
             onClick={() => setIsOpen(false)}
            >
            <FaTimes />
            </button>
  
             </div>
             <hr className="h-[1px] mb-4 mt-4 bg-[var(--softBg4)] border-0" />
  
  
              {step === 1 && (
                <>
                    <h2 className="text-2xl block md:hidden text-[var(--softTextColor)] font-semibold mb-1">Where do you wanna stay?</h2>
             <h2 className="hidden md:block text-2xl text-[var(--softTextColor)] font-semibold mb-1">Where do you wanna stay /Property location?</h2>
  
                  <h2 className="text-sm text-[var(--softTextColor)] mb-4 "> Find your perfect location!</h2>
                  <input
                    type="text"
                    placeholder="City, Region, or Country"
                    className="w-full p-2 text-[var(--softTextColor)] border border-[var(--softBg4)] bg-[var(--bg)] rounded-md mb-4"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
  
                            <hr className="h-[1px] mb-4 mt-4 bg-[var(--softBg4)] border-0" />
  
  
  
                  <h2 className="text-2xl text-[var(--softTextColor)] font-semibold mb-1">Do you want to rent or buy?</h2>
                  <h2 className="text-sm text-[var(--softTextColor)] mb-4"> Choose your perfect option!</h2>          
                        <select
                    className="w-full p-2  bg-[var(--bg)] border border-[var(--softBg4)] rounded-md"
                    value={filters.model}
                    onChange={(e) =>
                      setFilters({ ...filters, model: e.target.value })
                    }
                  >
                    <option value="">For rent /For sale</option>
                    <option value="forrent">For Rent</option>
                    <option value="forsale">For Sale</option>
                  </select>
  
                </>
              )}
  
              {step === 2 && (
                <>
                 <h2 className="text-2xl text-[var(--softTextColor)] font-semibold mb-1">
                 Find your perfect place!</h2>
                  <h2 className="text-sm text-[var(--softTextColor)] mb-4"> What type of property are you looking for!</h2>  
                  <select
                    className="w-full p-2 border border-[var(--softBg4)]  bg-[var(--bg)]  rounded-md mb-4"
                    value={filters.propertytype}
                    onChange={(e) =>
                      setFilters({ ...filters, propertytype: e.target.value })
                    }
                  >
                    <option value="">Any type of property</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="land">Land</option>
                  </select>
  
                             <hr className="h-[1px] mb-4 mt-4 bg-[var(--softBg4)] border-0" />
  
  
  
                  <div className="space-y-4">
    <div className="flex items-center justify-between gap-2 md:gap-4  text-[var(--softTextColor)]">
      <div>
        <p className="font-semibold">Bedrooms</p>
        <p className="text-sm">How many bedrooms do you need?</p>
      </div>
      <div className="flex items-center gap-2">
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--softBg4)] text-[var(--softTextColor)]"
      onClick={() =>
        setFilters((prevFilters) => ({
          ...prevFilters,
          bedrooms: Math.max(0, (prevFilters.bedrooms || 0) - 1),
        }))
      }
    >
      -
    </button>
    <span className="w-8 text-center">{filters.bedrooms || 0}</span>
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--softBg4)] text-[var(--softTextColor)]"
      onClick={() =>
        setFilters((prevFilters) => ({
          ...prevFilters,
          bedrooms: (prevFilters.bedrooms || 0) + 1,
        }))
      }
    >
      +
    </button>
  </div>
  
    </div>
  
               <hr className="h-[1px] mb-4 mt-4 bg-[var(--softBg4)] border-0" />
  
  
    <div className="flex items-center gap-2 md:gap-4 justify-between text-[var(--softTextColor)]">
      <div>
        <p className="font-semibold">Bathrooms</p>
        <p className="text-sm">How many bathrooms do you need?</p>
      </div>
      <div className="flex items-center gap-2">
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--softBg4)] text-[var(--softTextColor)]"
      onClick={() =>
        setFilters((prevFilters) => ({
          ...prevFilters,
          bathrooms: Math.max(0, (prevFilters.bathrooms || 0) - 1),
        }))
      }
    >
      -
    </button>
    <span className="w-8 text-center">{filters.bathrooms || 0}</span>
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--softBg4)] text-[var(--softTextColor)]"
      onClick={() =>
        setFilters((prevFilters) => ({
          ...prevFilters,
          bathrooms: (prevFilters.bathrooms || 0) + 1,
        }))
      }
    >
      +
    </button>
  </div>
  
    </div>
  </div>
  
  
                </>
              )}
  
              {step === 3 && (
                <>
             <h2 className="text-2xl text-[var(--softTextColor)] font-semibold mb-1">How much do you want do spent?</h2>
             <h2 className="text-sm text-[var(--softTextColor)] mb-4 "> Choose your perfect price!</h2>                <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="w-full p-2 border border-[var(--softBg4)]  bg-[var(--bg)] rounded-md"
                      min="0"
                      value={filters.pricemin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pricemin: Math.max(0, e.target.value),
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="w-full p-2 border border-[var(--softBg4)]  bg-[var(--bg)] rounded-md"
                      min="0"
                      value={filters.pricemax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pricemax: Math.max(0, e.target.value),
                        })
                      }
                    />
                  </div>
                             <hr className="h-[1px] mb-4 mt-4 bg-[var(--softBg4)] border-0" />
  
  
                </>
              )}
  
  <div className="flex justify-between  mt-4 md:mt-8 gap-4 ">
    {step > 1 && (
      <button
        className="flex-1 py-3 bg-[var(--bg)] border-[1px] border-[var(--softBg4)] rounded-md"
        onClick={() => setStep(step - 1)}
        disabled={step === 1}
      >
        Back
      </button>
    )}
    <button
      className={`flex-1 py-3 bg-[#2F74FD] hover:bg-[#0556f7] text-white rounded-md ${
        step === 1 ? "w-full" : ""
      }`}
      onClick={handleNext}
    >
      {step < 3 ? "Next" : "Search"}
    </button>
  </div>
  
            </div>
          </div>
          </div>
        )}
      </>
  );
};

export default Search;
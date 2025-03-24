



  import { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
  import "../index.css";
  import { AiOutlineMenu } from "react-icons/ai";
  import Avatar from "./Avatar";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { FaSearch, FaTimes } from "react-icons/fa";
  import Search from "./Search";
  
  
  const Navbar = () => {
  
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
  
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

    
  const [open, setOpen] = useState(false);

  const handleOverlayClick = () => setOpen(false);

  // Disable body scroll when the menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup in case of unmount
    };
  }, [open]);
  
    const [isScrolledUp, setIsScrolledUp] = useState(false);
  
    useEffect(() => {
      let lastScrollTop = window.scrollY;
  
      const handleScroll = () => {
        let scrollTop = window.scrollY;
  
        if (scrollTop > lastScrollTop && scrollTop > 50) {
          setIsScrolledUp(true); // Collapse when scrolling up
        } else if (scrollTop < 10) {
          setIsScrolledUp(false); // Expand when back at the top
        }
  
        lastScrollTop = scrollTop;
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
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
  
      
       // Modify or remove z-index here
       <div
       style={{
          zIndex: 100004,
       }}
       className={`relative w-full px-3 md:px-[80px] gap-3 md:gap-6 flex items-center text-[var(--TextColor)] sticky top-0 justify-center bg-[var(--bg)] md:border-b  duration-3 md:border-b-[var(--softBg4)] ${isScrolledUp ? "h-[120px]" : "h-[180px]"}`}
    >
  
  
    {/* Show on medium screens and larger */}
    <Link to="/" className="flex items-center gap-1 text-xl font-bold md:text-3xl hidden md:flex">
      <img src="/airlogo2.png" className="md:h-8" />
    </Link>
    
  
  
    <>
  <div
  className={`fixed top-0  w-full z-50 hidden md:flex flex-col items-center justify-center transition-all  ${isScrolledUp ? "pt-0 gap-0" : "pt-6 gap-6" }`}
    >
      {/* Rent & Sale Links */}
      <div
        className={`flex justify-center gap-[40px]  duration-3000 transition-all ${
          isScrolledUp ? "opacity-0 translate-y-[-20px] pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <a href="?model=forrent" className="text-[16px] font-semibold text-[var(--softTextColor)] hover:underline">
          For Rent
        </a>
        <a href="?model=forsale" className="text-[16px] font-semibold text-[var(--softBg5)] hover:underline">
          For Sale
        </a>
      </div>




    {/* search button for md screens */}

    <button
  onClick={() => setIsOpen(true)}
  type="button"
  className={`border-[1px] border-[var(--softBg4)]  duration-30000 w-full mx-auto rounded-full shadow-sm hover:shadow-md transition cursor-pointer ${
    isScrolledUp ? "max-w-[500px] " : "max-w-[1000px]"
  }`}
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
        <span className="hidden md:block text-[14px] ml-4 text-[var(--softBg5)]">
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
        <span className="hidden md:block text-[14px] text-[var(--softBg5)]">
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
        <span className="hidden md:block text-[14px] text-[var(--softBg5)]">
          Filter by price
        </span>
      )}
    </div>

    <div className={`hidden md:block h-[30px] ${isScrolledUp ? "md:h-[30px]" : "md:h-[40px]"} border-l-[1px] border-[var(--softBg4)]`}></div>

    {/* Property Type */}
    <div
      className={`relative hidden md:block hover:bg-[var(--softBg4)] rounded-full group p-2 ${
        isScrolledUp ? "md:px-4" : "md:px-8"
      } flex flex-col items-start text-left flex-1`}
    >
      <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition"   style={{ whiteSpace: 'nowrap' }}>
        {filters.propertytype || "Any type"}
      </small>
      {!isScrolledUp && (
        <span className="hidden md:block text-[14px] text-[var(--softBg5)]">
          Filter by type
        </span>
      )}
    </div>

    {/* Search Icon */}
    <div className="p-2">
      <div
        className={`bg-[#fc3239] rounded-full text-white transition-transform  hover:scale-110 hover:bg-[#d82930] ${
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
  type="button"
  className="w-full block md:hidden border-[1px] border-[var(--softBg4)] rounded-full shadow-sm hover:shadow-md transition
   duration-300 cursor-pointer"
>
  <div className="flex flex-row items-center relative gap-2 w-full justify-between">
    {/* Location */}
    <div className="relative hover:bg-[var(--softBg4)] rounded-full group p-2 md:px-8 flex flex-col items-start text-left flex-1">
      <small className="text-[12px] md:text-[13px] ml-4 font-semibold text-[var(--softTextColor)] transition">
        {filters.location || "Anywhere"}
      </small>
      <span className="hidden md:block text-[14px] ml-4 text-[var(--softBg5)]">
        Search by location
      </span>
    </div>

    <div className="h-[30px] md:h-[40px] border-l-[1px] border-[var(--softBg4)]"></div>

    {/* Property Size */}
    <div className="relative hover:bg-[var(--softBg4)] rounded-full group p-2 md:px-8 flex flex-col items-start text-left flex-1">
      <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition">
        {filters.propertysize || "Any size"}
      </small>
      <span className="hidden md:block text-[14px] text-[var(--softBg5)]">
        Filter by size
      </span>
    </div>

    <div className="hidden md:block h-[30px] md:h-[40px] border-l-[1px] border-[var(--softBg4)]"></div>

    {/* Price */}
    <div className="relative hidden md:block hover:bg-[var(--softBg4)] rounded-full group p-2 md:px-8 flex flex-col items-start text-left flex-1">
      <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition">
        {filters.pricemin || filters.pricemax ? (
          <>
            {filters.pricemin ? `KSh ${filters.pricemin}` : "KSh 0"} -{" "}
            {filters.pricemax ? `KSh ${filters.pricemax}` : "KSh 0"}
          </>
        ) : (
          "Any price"
        )}
      </small>
      <span className="hidden md:block text-[14px] text-[var(--softBg5)]">
        Filter by price
      </span>
    </div>

    <div className="hidden md:block h-[30px] md:h-[40px] border-l-[1px] border-[var(--softBg4)]"></div>

    {/* Property Type */}
    <div className="relative hidden md:block hover:bg-[var(--softBg4)] rounded-full group p-2 md:px-8 flex flex-col items-start text-left flex-1">
      <small className="text-[12px] md:text-[13px] font-semibold text-[var(--softTextColor)] transition">
        {filters.propertytype || "Any type"}
      </small>
      <span className="hidden md:block text-[14px] text-[var(--softBg5)]">
        Filter by type
      </span>
    </div>

    {/* Search Icon */}
    <div className="p-2">
      <div className="p-3 md:p-4 bg-[#fc3239] rounded-full text-white transition-transform duration-300 hover:scale-110 hover:bg-[#d82930]">
        <FaSearch className="text-[12px] md:text-[14px]" />
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
                <h2 className="text-2xl text-[var(--softTextColor)] font-semibold mb-1">Where do you wanna stay /Property location?</h2>
           <h2 className="hidden md:block">/Property location?</h2>

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
    className={`flex-1 py-3 bg-[#fc3239] text-white rounded-md ${
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
       
  
       <div className="flex items-center justify-between flex-row gap-2 md:gap-9">
  
  
      
  
        
  
          
     
  
  
  
    <div className="relative"  onClick={() => setOpen((prev) => !prev)}>
        <div className="flex flex-row items-center gap-3">
              <button
                type="button"
                className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-[var(--softBg4)] transition cursor-pointer text-[var(--softBg5)]"
              >
                Add listing
              </button>
                <button
                  type="button"
                  className=" p-4 md:py-1 md:pl-4 md:pr-2 border-[1px]  border-[var(--softBg4)]  flex  flex-row  items-center   gap-3   rounded-full   cursor-pointer   hover:shadow-md   transition duration-300"
                >
                  <AiOutlineMenu />
                  <div className="hidden md:flex items-center justify-center">
    <SignedIn>
      <div className="flex items-center  w-[38px] h-[38px] justify-center">
        <UserButton />
      </div>
    </SignedIn>
  
    <SignedOut>
      <img
        className="rounded-full text-[14px] w-[38px] h-[38px] select-none"
        alt="Avatar"
        src="/placeholder.jpg"
      />
    </SignedOut>
  </div>
  
                </button>
        </div>
  
  
  
        
      </div>
  
  
  
  
            
          </div>
  
          {/* DARK OVERLAY */}
          {open && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleOverlayClick}
            ></div>
          )}
  
          {/* MOBILE LINK LIST */}
          <div
            className={`w-[80%] md:w-[20%]  overflow-y-auto h-cover bg-[var(--bg)] flex flex-col p-5 items-left justify-left  text-[var(--TextColor)] 
              gap-8 font-sm text-md fixed top-0 right-0  bottom-0 overflow-x-hidden transition-transform ease-in-out z-50 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}   style={{ maxHeight: "100vh" }}
  
          >
  <div>
  
  </div>
  
            <button
              className="absolute top-2  right-8 text-md text-[var(--TextColor)]"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
  
  
  <div className="flex flex-row">
  
  
  
  
  
          <div>
  
  
          <div >
          <Link
              to="/"
              className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239] p-2 rounded-xl"
     onClick={() => setOpen(false)}          > Home           </Link>   
       <Link
     to="/"
     className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
  onClick={() => setOpen(false)}          > Book summaries          </Link>
          <Link
              to="/"
              className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
     onClick={() => setOpen(false)}          > Discover          </Link>
            <Link
              to="/premium"
              className="block py-2 text-[var(--TextColor)] font-bold   hover:text-[#fc3239]  p-2 rounded-xl"
     onClick={() => setOpen(false)}          > Premium          </Link>
            <Link
              to="/about"
              className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
     onClick={() => setOpen(false)}          > About Us 
            </Link>
            <Link
              to="/settings"
              className="block py-2 text-[var(--TextColor)] font-bold   hover:text-[#fc3239]  p-2 rounded-xl"
     onClick={() => setOpen(false)}              > Settings          </Link>
            
       <Link
              to="/premium"
              className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
     onClick={() => setOpen(false)}              > Pricing           </Link>
          </div>
          
          </div>
  
  
  
          </div>
  
  
  
  
  
         
  
            <SignedOut>
            <Link
              to="/login"
              className="w-full items-center  md:ml-2 mr-4 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3
               bg-[#fc3239]  text-white font-semibold 
              rounded-md hover:bg-[#FF5A5F]   "
            >
            Login     
                 </Link>
            </SignedOut>
  
          </div>
  
  
     
  
       
        </div>
    );
  };
  
  export default Navbar;
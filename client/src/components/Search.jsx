import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";

const Search = () => {
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


  return (
    <>
      <button
        type="button"
        className="border-[1px] border-[var(--softBg4)] w-full md:w-auto py-3 rounded-full shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-row justify-between items-center">
          <small className="  text-[12px] md:text-[14px] font-bold px-6 text-[var(--softTextColor)]">
            {filters.location || "Anywhere"}
          </small>

          <small className=" text-[12px] md:text-[14px] font-bold px-6 border-x-[1px] border-x-[var(--softBg4)] flex-1 text-center text-[var(--softTextColor)]]">
  {filters.pricemin || filters.pricemax ? (
    <>
      {filters.pricemin ? `KSh ${filters.pricemin * 150}` : "KSh 0"} -{" "}
      {filters.pricemax ? `KSh ${filters.pricemax * 150}` : "KSh 0"}
    </>
  ) : (
    "Any price"
  )}
</small>

          <div className=" text-[12px] md:text-[14px] text-[var(--softTextColor)] pl-6 pr-2  flex flex-row items-center gap-4">
            <small className="hidden sm:block font-normal  text-[12px] md:text-[14px] m">
              {filters.propertytype || "Any type"}
            </small>
            <div className="p-4 bg-[#fc3239] rounded-full text-white">
              <FaSearch className=" text-[12px] md:text-[14px]" /> 
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
           

          <div className="bg-[var(--bg)] p-6 rounded-xl border-[0.5px]  border-[var(--softBg4) shadow-lg w-96 min-h-[250px] flex flex-col justify-between">
          <button
              className="absolute top-4 right-4 text-[var(--softTextColor)]  hover:font-bold"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>

            {step === 1 && (
              <>
                <h2 className="text-lg text-[var(--softTextColor)] font-bold mb-4">Enter Your Location</h2>
                <input
                  type="text"
                  placeholder="City, Region, or Country"
                  className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] rounded-xl mb-4"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />

                <h2 className="text-lg text-[var(--softTextColor)] font-bold mb-4">Select Model</h2>
                <select
                  className="w-full p-2  bg-[var(--bg) border border-[var(--softBg4)] rounded-xl"
                  value={filters.model}
                  onChange={(e) =>
                    setFilters({ ...filters, model: e.target.value })
                  }
                >
                  <option value="">Any</option>
                  <option value="forrent">For Rent</option>
                  <option value="forsale">For Sale</option>
                </select>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg text-[var(--softTextColor)] font-bold mb-4">Select Property Type</h2>
                <select
                  className="w-full p-2 border border-[var(--softBg4)]  bg-[var(--bg)  rounded-xl mb-4"
                  value={filters.propertytype}
                  onChange={(e) =>
                    setFilters({ ...filters, propertytype: e.target.value })
                  }
                >
                  <option value="">Any</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Bedrooms"
                    className="w-full p-2 border  bg-[var(--bg) border-[var(--softBg4)]  rounded-xl"
                    min="0"
                    value={filters.bedrooms}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        bedrooms: Math.max(0, e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Bathrooms"
                    className="w-full p-2 border border-[var(--softBg4)]  bg-[var(--bg) rounded-xl"
                    min="0"
                    value={filters.bathrooms}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        bathrooms: Math.max(0, e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg text-[var(--softTextColor)] font-bold mb-4">Set Price Range</h2>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full p-2 border border-[var(--softBg4)]   bg-[var(--bg) rounded-xl"
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
                    className="w-full p-2 border border-[var(--softBg4)]  bg-[var(--bg) rounded-xl"
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
              </>
            )}

            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  className="px-4 py-2 bg-[var(--softBg4)] rounded-xl"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Back
                </button>
              )}
              <button
                className="px-4 py-2 bg-[#fc3239] text-white rounded-xl"
                onClick={handleNext}
              >
                {step < 3 ? "Next" : "Search"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;

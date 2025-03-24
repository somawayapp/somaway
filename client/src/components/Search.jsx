import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

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
    priceMin: "",
    priceMax: "",
    model: "",
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Apply filters when done
      setSearchParams({
        ...Object.fromEntries(searchParams),
        ...filters,
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* SEARCH BUTTON */}
      <button
        type="button"
        className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-row justify-between items-center">
          <small className="text-sm font-bold px-6 text-[#585858]">
            {filters.location || "Anywhere"}
          </small>

          <small className="hidden sm:block text-sm font-bold px-6 border-x-[1px] flex-1 text-center text-[#585858]">
            {filters.priceMin && filters.priceMax
              ? `${filters.priceMin} - ${filters.priceMax}`
              : "Any price"}
          </small>

          <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-4">
            <small className="hidden sm:block font-normal text-sm">
              {filters.propertytype || "Any type"}
            </small>
            <div className="p-2 bg-[#FF5A5F] rounded-full text-white">
              <FaSearch className="text-[12px]" />
            </div>
          </div>
        </div>
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {step === 1 && (
              <>
                <h2 className="text-lg font-bold mb-4">Enter Your Location</h2>
                <input
                  type="text"
                  placeholder="City, Region, or Country"
                  className="w-full p-2 border rounded mb-4"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-bold mb-4">Select Property Type</h2>
                <select
                  className="w-full p-2 border rounded mb-4"
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
                    className="w-full p-2 border rounded"
                    value={filters.bedrooms}
                    onChange={(e) =>
                      setFilters({ ...filters, bedrooms: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Bathrooms"
                    className="w-full p-2 border rounded"
                    value={filters.bathrooms}
                    onChange={(e) =>
                      setFilters({ ...filters, bathrooms: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Property Size"
                    className="w-full p-2 border rounded"
                    value={filters.propertysize}
                    onChange={(e) =>
                      setFilters({ ...filters, propertysize: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Rooms"
                    className="w-full p-2 border rounded"
                    value={filters.rooms}
                    onChange={(e) =>
                      setFilters({ ...filters, rooms: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-bold mb-4">Set Price & Model</h2>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full p-2 border rounded"
                    value={filters.priceMin}
                    onChange={(e) =>
                      setFilters({ ...filters, priceMin: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-full p-2 border rounded"
                    value={filters.priceMax}
                    onChange={(e) =>
                      setFilters({ ...filters, priceMax: e.target.value })
                    }
                  />
                </div>

                <select
                  className="w-full p-2 border rounded mt-4"
                  value={filters.model}
                  onChange={(e) =>
                    setFilters({ ...filters, model: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="forrent">For Rent</option>
                  <option value="forsale">For Sale</option>
                </select>
              </>
            )}

            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
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

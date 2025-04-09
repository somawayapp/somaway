import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBath, FaRulerCombined } from "react-icons/fa";
import { FaBuilding,FaCouch, FaDoorOpen, FaWarehouse, FaHome, FaTree, FaBed } from "react-icons/fa";
import { MdVilla, MdApartment } from "react-icons/md";
import { TbBuildingCommunity } from "react-icons/tb";
import { GiOfficeChair, GiShop, GiCastle, GiCargoCrate } from "react-icons/gi";
import { FaSwimmingPool, FaWifi, FaParking, FaLeaf, FaBabyCarriage } from 'react-icons/fa';
import { MdBalcony, MdAir, MdFitnessCenter, MdSecurity, MdOutlineBackup} from 'react-icons/md';
import { ArrowUpCircle } from "lucide-react";
import PropertySwitcher from "./PropertySwitcher";
const propertytypes = [
  "apartment",
  "studio",
  "bedsitter",
  "single-room",
  "town-house",
  "bungalow",
  "mansionatte", 
  "villa",
  "container",
  "office",
  "shop",
  "warehouse",
  "land",
];

const icons = {
  apartment: <FaBuilding />,
  studio: <FaCouch   />,
  bedsitter: <FaBed />,
  "single-room": <FaDoorOpen  />,
  "town-house": <TbBuildingCommunity />,
  bungalow: <FaHome />,   
  mansionatte: <GiCastle/>, 
  villa: <MdVilla />,
  container: <GiCargoCrate />,
  office: <GiOfficeChair />,
  shop: <GiShop />,
  warehouse: <FaWarehouse />,
  land: <FaTree />,
};

const CategoriesScroll = ({ setOpen }) => {
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scroll = (direction) => {
    const scrollAmount = 200;
    if (direction === "left") {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScrollPosition();
    const container = containerRef.current;
    container.addEventListener("scroll", checkScrollPosition);
    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <div className="relative shadow-sm md:shadow-md">
      <div className="px-4 md:px-[80px]">
        
        {/* Outer flex container with relative position */}
        <div className="relative flex items-start mb-5">
          
          {/* Scrollable Categories */}
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pr-2"
            style={{ whiteSpace: "nowrap", flex: 1 }}
          >
            {propertytypes.map((propertytype) => {
              const slug = propertytype.toLowerCase().replace(/\s+/g, "").replace(/&/g, "-");
              return (
                <Link
                  key={propertytype}
                  to={`/?propertytype=${slug}`}
                  className="flex flex-col items-center justify-center gap-2 md:gap-3 text-[var(--softTextColor)] hover:text-[var(--textColor)] text-sm
                  md:text-md bg-[var(--bg)] rounded-xl pr-2 md:pr-[45px] pb-3 transition-all"
                  onClick={() => setOpen(false)}
                >
                  {icons[propertytype] && (
                    <span
                      className="text-[var(--softBg5)] hover:text-[var(--softTextColor)]"
                      style={{
                        fontSize: window.innerWidth <= 768 ? "20px" : "25px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {icons[propertytype]}
                    </span>
                  )}
                  <span className="text-xs font-normal md:text-sm">{propertytype}</span>
                </Link>
              );
            })}
          </div>
  
          {/* Right Scroll Button JUST BEFORE the PropertySwitcher */}
          {showRightButton && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-[110px] top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--softBg4)] bg-opacity-85 rounded-full py-2 px-4 z-10"
              style={{ border: "none" }}
            >
              <span className="text-[var(--bg)] font-bold">&gt;</span>
            </button>
          )}
  
          {/* Left Scroll Button at far left */}
          {showLeftButton && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 hidden md:block bg-[var(--softBg4)] bg-opacity-85 rounded-full py-2 px-4 z-10"
              style={{ border: "none" }}
            >
              <span className="text-[var(--bg)] font-bold">&lt;</span>
            </button>
          )}
  
          {/* PropertySwitcher always visible at the end */}
          <div className="flex-shrink-0 hidden md:block pl-4">
            <PropertySwitcher />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default CategoriesScroll;

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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPropertytype = searchParams.get('propertytype'); // Get current model


  const handleClickPropertytype = (propertytype) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('propertytype', propertytype);
    setSearchParams(newParams); // Triggers rerender with updated model param
  };

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
    setShowRightButton(scrollLeft + clientWidth -400 < scrollWidth);
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
    <div className="relative  md:shadow-md">
      <div className="px-4 md:px-[80px]">
        
        <div className="relative flex items-start ">
          
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
                onClick={() => handleClickPropertytype(slug)}
                className={`flex flex-col items-center justify-center gap-2 text-[var(--softTextColor)] group transition-transform duration-200 
                  hover:scale-102 md:hover:scale-105 text-sm md:text-md bg-[var(--bg)] px-1 md:px-[16px]
                  ${currentPropertytype === propertytype ? 'text-[var(--textColor)]' : ''}`}
              >
                {icons[propertytype] && (
                  <span
                    className={`transition-transform duration-200 md:group-hover:scale-105 group-hover:text-[var(--textColor)] ${
                      currentPropertytype === propertytype ? 'text-[var(--textColor)]' : 'text-[var(--softBg5)]'
                    }`}
                    style={{
                      fontSize: window.innerWidth <= 768 ? "20px" : "25px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {icons[propertytype]}
                  </span>
                )}
                <span
                  className={`group-hover:text-[var(--textColor)] transition-transform duration-200  md:group-hover:scale-105 capitalize font-normal text-[13px] md:text-sm pb-[4px] md:pb-[4]
                    ${currentPropertytype === propertytype ? 'text-[var(--textColor)] border-b-2 border-[var(--textColor)]' : ''}`}
                >
                  {propertytype}
                </span>
              </Link>
              
              
              
              );
            })}
          </div>
  
          {/* Right Scroll Button JUST BEFORE the PropertySwitcher */}
          {showRightButton && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-[265px] top-[37%]  transition-transform duration-200 group-hover:scale-105 transform -translate-y-1/2 
              hidden md:block border-[1px] border-[var(--softBg4)] bg-[var(--bg)] bg-opacity-85 rounded-full px-[12px] py-[4px]  z-10"
            >
              <span className="text-[var(--softTextColor)] font-bold">&gt;</span>
            </button>
          )}
  
          {/* Left Scroll Button at far left */}
          {showLeftButton && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-1 top-[37%] transition-transform duration-200 group-hover:scale-105  transform -translate-y-1/2 hidden 
              md:block border-[1px]  border-[var(--softBg4)] bg-[var(--bg)] bg-opacity-85 rounded-full  px-[12px] py-[4px] z-10"
            >
              <span className="text-[var(--softTextColor)] font-bold">&lt;</span>
            </button>
          )}
  
          {/* PropertySwitcher always visible at the end */}
          <div className="flex-shrink-0 hidden md:block pl-[60px]">
            <PropertySwitcher />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default CategoriesScroll;

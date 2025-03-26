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

const categories = [
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
    <div className="relative">
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/3 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-5 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&lt;</span>
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/3 transform -translate-y-1/2 hidden md:block bg-[var(--shadow-color)] bg-opacity-50 rounded-full py-2 px-4 z-10"
          style={{ border: "none" }}
        >
          <span className="text-white font-bold">&gt;</span>
        </button>
      )}

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto mb-5 scrollbar-hide"
        style={{ whiteSpace: "nowrap" }}
      >
        {categories.map((category) => {
          const slug = category.toLowerCase().replace(/\s+/g, "").replace(/&/g, "-");

          return (
            <Link
              key={category}
              to={`/?cat=${slug}`}
              className="flex flex-col items-center gap-2 md:gap-4 justify-center text-[var(--softTextColor)] text-sm
              md:text-lg bg-[var(--bg)] shadow-xl hover:shadow-md rounded-xl
               px-5 py-2 md:px-7 transition-all"
              onClick={() => setOpen(false)}
            >
              {icons[category] && (
                <span style={{ 
                  fontSize: "30px",
                  display: "flex", 
                  alignItems: "center",
                  color: "black",
                  fill: "black"
                }}>
                  {icons[category]}
                </span>
              )}
              <span className="text-xs font-normal text-[var(--softTextColor)] hoover:font-semibold md:text-sm">{category}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesScroll;

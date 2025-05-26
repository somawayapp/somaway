import React from "react";

const Sidebar = () => {
  const sections = [
    {
      title: "",
      items: [ { name: "Offers", icon: "💎" },],
    },
    {
      title: "TRENDING",
      items: [
    { name: "PSL", icon: "⚽ " },      
    { name: "IRE vs WI", icon: "🥅" },              
    { name: "NBA Playoffs", icon: "🏀" },            
    { name: "Monaco Grand Prix", icon: "🏎️" },      
    { name: "Weekly Jackpot", icon: "🎉" },          
    { name: "French Open", icon: "🎾" }, 
      ],
    },
    {
      title: "GAMES",
      items: [
      { name: "Daily Draw", icon: "🎟️" },  
    { name: "Weekly Winners", icon: "🏆" },    
    { name: "Monthly Jackpot", icon: "🎯" }, 
      ],
    },
  ];

  return (
           <div className=" px-[25%]">
  {/* Fixed Sidebar */}
  <div className="hidden md:flex  flex-col    py-5 overflow-y-scroll whitespace-nowrap min-w-fit">
    {sections.map((section, idx) => (
      <div key={idx} className="mb-9">
        <h2 className="text-sm font-bold mb-3" style={{ color: "#f36dff" }}>
          {section.title}
        </h2>
        <ul className="space-y-3">
          {section.items.map((item, i) => (
            <li key={i} className="group flex items-center gap-3 cursor-pointer">
              <span className="text-xl group-hover:scale-110 transition-transform duration-150">
                {item.icon}
              </span>
              <span className="text-[#f2f2f2] group-hover:text-[#f36dff] text-sm font-semibold">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>

  {/* Mobile Horizontal Scroll Menu */}
  <div className="md:hidden w-full overflow-x-auto whitespace-nowrap no-scrollbar py-3 flex gap-3">
    {sections.flatMap((section) => section.items).map((item, i) => (
      <div
        key={i}
        className="flex flex-col items-center justify-center min-w-[70px] cursor-pointer group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform duration-150">
          {item.icon}
        </span>
        <span className="text-[10px] mt-1 text-[#f2f2f2] group-hover:text-[#f36dff] text-center font-semibold">
          {item.name}
        </span>
      </div>
    ))}
  </div>


</div>


  );
};

export default Sidebar;

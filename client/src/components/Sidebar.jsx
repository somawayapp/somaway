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
     { name: "IPL", icon: "🏏" },                  
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
    { name: "Live", icon: "📺" },   
      ],
    },
  ];

  return (
    <div className="hidden md:flex flex-col pr-[8%] border-r border-black p-4 min-w-fit">
      {sections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h2 className="text-sm font-bold mb-3" style={{ color: "#1ff8b0" }}>
            {section.title}
          </h2>
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li key={i} className="group flex items-center gap-3 cursor-pointer">
                <span className="text-xl group-hover:scale-110 transition-transform duration-150">
                  {item.icon}
                </span>
                <span className="text-[#f2f2f2] group-hover:text-[#1ff8b0] text-sm font-semibold">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

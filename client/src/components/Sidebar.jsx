import React from "react";

const Sidebar = () => {
  const sections = [
    {
      title: "OFFERS",
      items: [],
    },
    {
      title: "TRENDING",
      items: [
        { name: "IPL", icon: "🏏" },
        { name: "EPL", icon: "⚽" },
        { name: "Casinos", icon: "🎰" },
        { name: "Honeypot", icon: "🍯" },
        { name: "Jackpot", icon: "💰" },
      ],
    },
    {
      title: "GAMES",
      items: [
        { name: "Daily", icon: "📅" },
        { name: "Weekly", icon: "🗓️" },
        { name: "Monthly", icon: "📆" },
        { name: "Live", icon: "🔴" },
      ],
    },
  ];

  return (
    <div className="hidden md:flex flex-col border-r border-black p-4 min-w-fit">
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
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
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

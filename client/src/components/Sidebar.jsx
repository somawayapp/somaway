import React from "react";

const Sidebar = () => {
  const sections = [
   
        {
      title: "      Winners",
      items: [
        { name: "Latest", icon: "🏠", href: "/" },
        { name: "Winners", icon: "🏅", href: "/winners" },

      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Home", icon: "🏠", href: "/" },
        { name: "About", icon: "ℹ️", href: "/about" },
        { name: "How to join", icon: "📝", href: "/help" },
        { name: "Help Center", icon: "🆘", href: "/help" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", icon: "🔒", href: "/privacy" },
        { name: "Terms and Conditions", icon: "📜", href: "/terms" },
        { name: "Payment Terms", icon: "💳", href: "/payment-terms" },
      ],
    },
  ];

  return (
    <div className="pl-[23%] pr-[12%]">
      {/* Fixed Sidebar */}
      <div className="hidden md:flex flex-col py-5 overflow-y-scroll whitespace-nowrap min-w-fit">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-9">
            <h2 className="text-sm font-bold mb-3" style={{ color: "#f36dff" }}>
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-150">
                      {item.icon}
                    </span>
                    <span className="text-[#f2f2f2] group-hover:text-[#f36dff] text-sm font-semibold">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Menu */}
      <div className="md:hidden w-full overflow-x-auto whitespace-nowrap no-scrollbar py-3 flex gap-3">
        {sections.flatMap((section) => section.items).map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="flex flex-col items-center justify-center min-w-[70px] cursor-pointer group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-150">
              {item.icon}
            </span>
            <span className="text-[10px] mt-1 text-[#f2f2f2] group-hover:text-[#f36dff] text-center font-semibold">
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

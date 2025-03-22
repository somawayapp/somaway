import React from "react";

const WhatsAppContact = ({ data }) => {
  const handleClick = () => {
    window.open(`https://wa.me/${data.whatsapp}`, "_blank");
  };

  return (
    <div>
      <p
        className="p-4 flex items-center gap-2 text-green-600 hover:text-green-700 cursor-pointer transition-all"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 12.2c0-5.2-4.3-9.5-9.5-9.5S2.5 7 2.5 12.2a9.5 9.5 0 0 0 1.3 4.9L2 22l5.2-1.7a9.5 9.5 0 0 0 4.8 1.3c5.2 0 9.5-4.3 9.5-9.5z" />
          <path d="M16.5 15.3c-.5.3-1 .5-1.6.6-2.6.6-5.5-1.7-6.7-3.8-.3-.5-.5-1-.6-1.6 0-.5.2-.9.6-1.2.3-.2.7-.2 1.1 0l.9.4c.3.1.6.4.7.7l.2.4c.1.3 0 .6-.2.9-.1.2-.3.4-.3.4s.4.7 1 1.3c.6.6 1.3 1 1.3 1 .1 0 .2-.1.4-.3.3-.2.6-.3.9-.2l.4.2c.3.1.6.3.7.7l.4.9c.1.3.1.8-.1 1.1z" />
        </svg>
        WhatsApp: <span>{data.whatsapp}</span>
      </p>
    </div>
  );
};

export default WhatsAppContact;

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
const fetchPost = async (slug) => {
             
          
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
    return res.data;
  };

const ContactInfo = ({ data }) => {
    const {  data } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => fetchPost(slug),
      });

  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [canViewContact, setCanViewContact] = useState(false);

  const WHATSAPP_SHARE_KEY = `sharedToWhatsApp`;

  useEffect(() => {
    const sharedTime = localStorage.getItem(WHATSAPP_SHARE_KEY);
    if (sharedTime) {
      const hoursPassed = (Date.now() - parseInt(sharedTime)) / 1000 / 60 / 60;
      if (hoursPassed < 24) {
        setCanViewContact(true);
      } else {
        localStorage.removeItem(WHATSAPP_SHARE_KEY);
      }
    }

    if (isSignedIn) setCanViewContact(true);
  }, [isSignedIn]);

  const maskNumber = (number) => {
    if (!number) return "";
    return number.slice(0, 4) + "****";
  };

  const handleContactClick = () => {
    if (canViewContact) {
      window.location.href = `tel:${data.phone}`;
    } else {
      setShowPopup(true);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent("Hey! Check out this amazing site I found.");
    const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Simulate that sharing has happened - in a real app, you'd verify this with a backend
    localStorage.setItem(WHATSAPP_SHARE_KEY, Date.now().toString());
    setCanViewContact(true);
    setShowPopup(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div>
        <p
          className="p-4 text-[14px] md:text-[16px] text-[var(--softTextColor)] flex items-center gap-2 cursor-pointer hover:bg-[var(--softBg)] rounded-lg transition"
          onClick={handleContactClick}
        >
          <PhoneIcon />
          Contact: <span>{canViewContact ? data.phone : maskNumber(data.phone)} {canViewContact ? "" : "View contact info"}</span>
        </p>
      </div>

      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />

      <div>
        <p
          className="p-4 flex items-center text-[var(--softTextColor)] gap-2 text-[14px] md:text-[16px] cursor-pointer hover:bg-[var(--softBg)] rounded-lg transition-all"
          onClick={handleContactClick}
        >
          <WhatsAppIcon />
          WhatsApp: <span>{canViewContact ? data.whatsapp : maskNumber(data.whatsapp)} {canViewContact ? "" : "View contact info"}</span>
        </p>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">View Contact Info</h2>
            <p className="text-gray-600 mb-6">
              Share to <b>at least one WhatsApp group</b> or login to view full contact information.
            </p>
            <div className="flex flex-col gap-4">
              <button
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                onClick={handleWhatsAppShare}
              >
                Share to WhatsApp Group
              </button>
              <button
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={handleLogin}
              >
                Login to View Contact
              </button>
              <button
                className="text-gray-500 mt-2 text-sm"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Inline Icons
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2 2 19.79 19.79 0 0 1-8.63-2A19.79 19.79 0 0 1 2 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 1.72 12.34 12.34 0 0 0 .68 2.72
    2 2 0 0 1-.45 2.11l-1.42 1.42a16 16 0 0 0 6 6l1.42-1.42a2 2 0 0 1 2.11-.45
    12.34 12.34 0 0 0 2.72.68A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 12.2c0-5.2-4.3-9.5-9.5-9.5S2.5 7 2.5 12.2a9.5 9.5 0 0 0 1.3 4.9L2 22l5.2-1.7
    a9.5 9.5 0 0 0 4.8 1.3c5.2 0 9.5-4.3 9.5-9.5z" />
    <path d="M16.5 15.3c-.5.3-1 .5-1.6.6-2.6.6-5.5-1.7-6.7-3.8-.3-.5-.5-1-.6-1.6 0-.5.2-.9.6-1.2.3-.2.7-.2 1.1 0l.9.4c.3.1.6.4.7.7l.2.4c.1.3 0
    .6-.2.9-.1.2-.3.4-.3.4s.4.7 1 1.3c.6.6 1.3 1 1.3 1 .1 0 .2-.1.4-.3.3-.2.6-.3.9-.2l.4.2c.3.1.6.3.7.7l.4.9c.1.3.1.8-.1 1.1z" />
  </svg>
);
export default ContactInfo;
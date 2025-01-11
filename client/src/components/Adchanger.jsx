import { useState, useEffect } from "react";

const AdChanger = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    "/add1.gif",
    "/add2.gif",
    "/add4.gif",

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <img
      src={ads[currentAd]}
      alt="ads"
      className="w-full mt-10 h-full"
    />
  );
};

export default AdChanger;

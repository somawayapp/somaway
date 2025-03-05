import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "../index.css"; // Assuming styles are in App.css

const App = () => {
  const [zIndexObsolete, setZIndexObsolete] = useState(false);

  const toggleZIndex = () => {
    setZIndexObsolete(prev => !prev);
  };

  return (
    <div className={zIndexObsolete ? 'z-index-obsolete' : ''}>
      <UserButton onClick={toggleZIndex} />

      <div >
        {/* NAVBAR */}
        <Navbar />
        {/* BREADCRUMB */}
        {/* INTRODUCTION */}
        {/* FEATURED POSTS */}
        {/* POST LIST */}
      </div>
    </div>
  );
};

export default App;

 

 

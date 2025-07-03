import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" mt-5 px-4 md:px-[10px] mb-9  mt-[50px] text-[var(--softTextColor)] md:mt-[70px] font-medium text-sm border-t border-[var(--softBg)]">
      <div className="container mx-auto grid pt-5  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 flex justify-between">
        {/* Home Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Home</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Winners</a></li>
              <li><a href="/about" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">About</a></li>
            </ul>
          </nav>
        </div>



        {/* Resources Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <nav>
            <ul className="space-y-2">
             <li><a href="/join" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">How to join</a></li>
              <li><a href="/help" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Help Center</a></li>

            </ul>
          </nav>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Privacy Policy</a></li>
              <li><a href="/terms" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Terms and Conditions</a></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="mt-8 text-center border-t border-[var(--softBg)]  mb-[100px] md:mb-0  pt-4">
        <p className="text-[var(--softTextColor)]">
          © {currentYear},  Shilingi initiative Nairobi
       
          <a href="mailto:support@soma.ia.com" className="text-[var(--softTextColor)] pl-1 hover:text-[var(--softTextColor)]">
            support: shilingi@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

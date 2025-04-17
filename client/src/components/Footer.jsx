import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" mt-5 px-4 md:px-[80px] mb-9  mt-[50px] text-[var(--softTextColor)] md:mt-[70px] font-medium text-sm border-t border-[var(--softBg)]">
      <div className="container mx-auto grid pt-5  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Home Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Home</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Home</a></li>
              <li><a href="/premium" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Pricing</a></li>
              <li><a href="/" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Properties</a></li>

            </ul>
          </nav>
        </div>

        {/* Company Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/about" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">About</a></li>
              <li><a href="/coming-soon" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Careers</a></li>
              <li><a href="/coming-soon" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Affiliates</a></li>
            </ul>
          </nav>
        </div>

        {/* Resources Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Listings</a></li>
              <li><a href="/history" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Reviews</a></li>
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
              <li><a href="/subscription-terms" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Subscription Terms</a></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="mt-8 text-center border-t border-[var(--softBg)]  mb-[100px] md:mb-0  pt-4">
        <p className="text-[var(--softTextColor)]">
          © {currentYear},  Hodii App Limited, Waiyaki way , 1st floor, Westend towers, Westlands, Nairobi
       
          <a href="mailto:support@soma.ia.com" className="text-[var(--softTextColor)] pl-1 hover:text-[var(--softTextColor)]">
            support: Hodii@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" pt-5  mt-[50px] text-[var(--softTextColor)] md:mt-[70px] font-medium text-sm border-t border-[var(--softBg)]">
      <div className="container mx-auto grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Home Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Home</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/home" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Home</a></li>
              <li><a href="/for-business" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">For Business</a></li>
              <li><a href="/gift-somaai" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Gift somaAI</a></li>
            </ul>
          </nav>
        </div>

        {/* Company Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/about" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">About</a></li>
              <li><a href="/careers" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Careers</a></li>
              <li><a href="/family" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Family</a></li>
              <li><a href="/press-info" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Press Info</a></li>
              <li><a href="/affiliates" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Affiliates</a></li>
            </ul>
          </nav>
        </div>

        {/* Resources Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/book-summaries" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Book Summaries</a></li>
              <li><a href="/blog" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Blog</a></li>
              <li><a href="/faq" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">FAQ</a></li>
            </ul>
          </nav>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <nav>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Terms and Conditions</a></li>
              <li><a href="/subscription-terms" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Subscription Terms</a></li>
              <li><a href="/ai-usage-policy" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">AI Usage Policy</a></li>
              <li><a href="/gift-card-terms" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Gift Card Terms of Service</a></li>
              <li><a href="/notice-at-collection" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Notice at Collection</a></li>
              <li><a href="/do-not-sell" className="text-[var(--softTextColor)] hover:text-[var(--softTextColor)]">Do Not Sell or Share My Personal Information</a></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="mt-8 text-center border-t border-[var(--softBg)] pt-4">
        <p className="text-[var(--softTextColor)]">
          © {currentYear}, GTHW App Limited, 24 Peiraios Street, 1st floor, Strovolos, Nicosia, Cyprus
       
          <a href="mailto:support@soma.ia.com" className="text-[var(--softTextColor)] pl-1 hover:text-[var(--softTextColor)]">
            support@soma.ia.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

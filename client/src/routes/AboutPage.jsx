
import { Link } from "react-router-dom";

const PremiumPage = () => {
  return (
    <div className="mt-4 px-6 md:px-12 lg:px-24 flex flex-col gap-12">
      {/* BREADCRUMB */}
      <div className="flex gap-2 text-sm text-[var(--textColor)]">
        <Link to="/" className="hover:text-blue-800">
          Home
        </Link>
        <span>•</span>
        <span className="text-[#1da1f2]">About Us</span>
      </div>

      {/* INTRODUCTION */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-[#1da1f2] text-3xl md:text-4xl lg:text-5xl font-bold">
About Us    </h1>
        <p className="text-md md:text-xl text-[var(--textColor)] leading-relaxed">
        Discover what's happening now
        </p>

      
      </div>

<div className=" items-center gap-4 bg-[var(--textColore)] p-6 rounded-lg shadow-lg">


      <h2 className="text-[var(--textColor2)] text-3xl mt-[20px] font-semibold mb-4 text-center">
            Who WeAre        </h2>
        <p className="text-md md:text-md text-center text-[var(--textColor)] mb-[30px] leading-relaxed">
        Welcome to xtech, your trusted source for insightful news and
          updates on the tech world. Our mission is to keep you informed,
          inspired, and ahead of the curve in just 5 minutes a day.
        </p>

      {/* FEATURES */}
      <div >
        <h2 className="text-[var(--textColor2)] text-3xl font-semibold  text-center"
>
          Our Vission
        </h2>
                  <p className="text-md md:text-md text-center text-[var(--textColor)] mb-[30px] leading-relaxed">
        To be the leading platform for tech enthusiasts and professionals,
          bridging the gap between complex technologies and everyday life. Our
          vision is to inspire curiosity and fuel progress in the digital age.</p>
      </div>




</div>




      {/* TESTIMONIALS */}
      <div>
        <h2 className="text-[var(--textLogo)] text-3xl font-semibold mb-4 text-center">
          Meet The Team
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {["Mbelenzi Lexanda", "John Mandela", "Frank Kimeu"].map((name, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 bg-[var(--textColore)] p-6 rounded-lg shadow-lg"
            >
              {/* Circular Profile Image */}
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
            src="/profile.jpg"
            alt={`${name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name and Feedback */}
              <h3 className="text-lg font-medium text-[var(--textColor)] text-center">
                {name}
              </h3>
              <p className="text-sm text-[var(--textColor)] text-center italic">
                "editor"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="mt-6 text-center">


      {/* CONTACT US */}
      <div>
        <h2 className="text-[var(--textColor2)]  text-2xl font-semibold mb-4 text-center">
          Contact Us
        </h2>
    <p className="text-md md:text-md text-[var(--textColor)]  leading-relaxed text-center">
          Have questions, feedback, or ideas? We’d love to hear from you! Reach
          out to us at
          <a
            href="mailto:contact@xtech.com"
            className="text-[#1da1f2] underline ml-1"
          >
            xtechnewsletter@gmail.com
          </a>
          or call our hotline +254703394794
          .
        </p>
      </div>

      {/* CTA - Subscribe to Newsletter */}
      <div className="mt-6 text-center">
        <h3 className="text-[var(--textLogo)] text-xl font-semibold mb-2">
          Stay Updated
        </h3>
        <p className="text-md text-[var(--textColor)]  leading-relaxed">
          Subscribe to xtech and get your daily dose of tech news in just 5
          minutes.
        </p>
        <Link
          to="/newsletter"
          className="mt-4 inline-block px-6 py-2 bg-[#1da1f2]  mb-[150px] text-white rounded-full font-medium hover:bg-blue-700 transition duration-300"
        >
          Subscribe Now
        </Link>
      </div>
   </div>
    </div>
  );
};

export default PremiumPage;


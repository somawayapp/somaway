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
        <span className="text-[#1da1f2]">Premium</span>
      </div>

      {/* INTRODUCTION */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-[#1da1f2] text-3xl md:text-4xl lg:text-5xl font-bold">
          Welcome to Premium
        </h1>
        <p className="text-md md:text-xl text-[var(--textColor)] leading-relaxed">
          Unlock the ultimate tech experience with exclusive benefits and features.
        </p>

      
      </div>

      {/* TESTIMONIALS */}
      <div>
        <h2 className="text-[var(--textLogo)] text-3xl font-semibold mb-4 text-center">
          What Our Premium Members Say
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {["Greg Inseberg", "Lizza carter ", "James Omondi"].map((name, i) => (
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
              <h3 className="text-lg font-medium text-[var(--textColor)]text-center">
                {name}
              </h3>
              <p className="text-sm text-[var(--textColor)] text-center italic">
                "Joining Premium has been a game-changer for me. Highly recommend!"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="mt-6 text-center">
        <h3 className="text-[var(--textLogo)] text-xl font-semibold mb-2">
          Ready to Upgrade?
        </h3>
        <p className="text-md text-[var(--textColor)] leading-relaxed">
          Join our Premium members and elevate your tech experience today.
        </p>
        <Link
          to="/premium"
          className="mt-4 inline-block px-6 mb-[35px] py-2 bg-[#1da1f2] text-white rounded-full font-medium hover:bg-[#0875b9] transition duration-300"
        >
          Go Premium Now
        </Link>


        <h2 className="text-[var(--textColor2)] text-3xl mt-[20px] font-semibold mb-4 text-center">
          Why Go Premium?
        </h2>
        <p className="text-md md:text-md text-[var(--textColor)] leading-relaxed">
          Experience ad-free browsing, early access to tech updates, and in-depth
          insights designed for professionals and enthusiasts alike. Our premium
          tier gives you more tools to stay ahead in the digital age.
        </p>
      </div>

      {/* FEATURES */}
      <div>
        <h2 className="text-[var(--textColor2)] text-3xl font-semibold mb-4 text-center"
>
          Premium Features
        </h2>
        <ul className="text-md md:text-lg text-[var(--textColor)] mb-[150px] leading-relaxed list-disc list-inside space-y-2  items-center gap-4 bg-[var(--textColore)] p-6 rounded-lg shadow-lg">
          <li>Ad-free, uninterrupted experience.</li>
          <li>Exclusive Daily newsletter.</li>
          <li>Early access to exclusive tech news and updates.</li>
          <li>Premium tools for deeper insights and analytics.</li>
          <li>Personalized tech recommendations.</li>
          <li>Priority customer support.</li>
        </ul>
      </div>

      
    </div>
  );
};

export default PremiumPage;

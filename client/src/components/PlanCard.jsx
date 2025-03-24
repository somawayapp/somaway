import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const PlanCard = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    navigate('/subscribe', { state: { planPrice: plan.price, planName: plan.name } });
  };

  return (
    <div className="md:p-[30px]">
      <div className="relative w-full rounded-3xl md:rounded-[30px] text-[var(--textColor)] 
      text-center flex flex-col items-center justify-center animate-fadeIn">
        <div className="h-full p-1 md:p-4">
          <h1 className="text-3xl md:text-6xl font-bold">Choose Your Plan</h1>
          <p className="mt-2 text-md md:text-xl">
            Enjoy unlimited access to book summaries tailored for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 text--[var(--bg)] gap-6 mt-10 w-full px-4">
            {/* Monthly Plan */}
            <div
              className="bg-[var(--bd)] shadow-2xl rounded-2xl p-2 md:p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg border-[var(--textColore)]"
            >
              <p className="mt-3 text-md text-[var(--softTextColor)] mb-2 border border-2 border-[var(--softTextColor)] py-2 px-3 rounded-[20px] font-semibold">
                Monthly Plan
              </p>
              <p className="text-xl md:text-2xl mb-2 mt-3 font-semibold text-orange-500    border-b pb-2">
                $4.99/month
              </p>
              <div className="mt-4 text-sm md:text-md space-y-2 text-[var(--bg)]">
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  Access unlimited book summaries.
                </div>
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  7,500+ book and podcast summaries.
                </div>
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  <span className="line-through">Save more with annual billing.</span>
                </div>
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  Cancel anytime.
                </div>
              </div>

              <SignedIn>
                <button     onClick={() => handleSelectPlan({ name: 'Monthly Plan', price: 4.99 })}
           className="mt-6 bg-[#FF5A5F]    text-white py-3 px-6 w-full rounded-lg font-bold hover:bg-[#FF5A5F]    transition">
                  Subscribe Now
                </button>
              </SignedIn>

              <SignedOut>
  <Link to="/login"  className="mt-6 bg-[#FF5A5F]    text-white py-3 px-6 w-full rounded-lg font-bold hover:bg-[#FF5A5F]    transition">
      Login to Subscribe
  </Link>
</SignedOut>

            </div>

            {/* Annual Plan */}
            <div
              className="bg-[var(--bd)] shadow-2xl rounded-2xl p-2 md:p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg border-2 border-[var(--textColore)]"
            
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <p className="mt-3 text-md text-[var(--softTextColor)] mb-2 border border-2 border-[var(--softTextColor)] py-2 px-3 rounded-[20px] font-semibold">
                  Annual Plan
                </p>
                <span className="flex bg-orange-500 text-white text-md px-3 py-2 rounded-full">
                  <img
                    src="/fire.webp"
                    className="h-5 object-contain"
                  />
                  Most Popular
                </span>
              </div>
              <p className="text-xl md:text-2xl mb-2 font-semibold text-orange-500   border-b pb-2">
                $49.99/year
              </p>
              <div className="mt-4 text-sm md:text-md space-y-2 text-[var(--bg)]">
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  Access unlimited book summaries.
                </div>
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  7,500+ book and podcast summaries.
                </div>
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  Save more with annual billing.
                </div>
                <div className="flex text-[var(--textColor)] items-center gap-2">
                  <span className="bg-[#FF5A5F]    text-white rounded-full w-6 h-6 flex items-center justify-center">✓</span>
                  Cancel anytime.
                </div>
              </div>

              <SignedIn>
                <button   onClick={() => handleSelectPlan({ name: 'Annual Plan', price: 49.99 })} className="mt-6 bg-[#FF5A5F]    text-white py-3 px-6 w-full rounded-lg font-bold hover:bg-[#FF5A5F]    transition">
                  Subscribe Now
                </button>
              </SignedIn>

              <SignedOut>
  <Link to="/login" className="mt-6 bg-[#FF5A5F]    text-white py-3 px-6 w-full rounded-lg font-bold hover:bg-[#FF5A5F]    transition">
      Login to Subscribe
  </Link>
</SignedOut>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;

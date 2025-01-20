// PlanCard Component
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlanCard = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    navigate('/subscribe', { state: { planPrice: plan.price, planName: plan.name } });
  };

  return (
    <div className="p-2 md:p-[30px]">
      <div
        className="relative w-full rounded-3xl md:rounded-[30px] 
      text-[var(--textColor)] text-center flex flex-col items-center justify-center animate-fadeIn"
      >
        <div className="h-full p-4">
          <h1 className="text-3xl md:text-6xl font-bold">Choose Your Plan</h1>
          <p className="mt-2 text-md md:text-xl">
            Enjoy unlimited access to book summaries tailored for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 text--[var(--bg)] gap-6 mt-10 w-full px-4">
            {/* Monthly Plan */}
            <div
              className="bg-[var(--textColore)] shadow-md rounded-2xl p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg
              border-[var(--textColore)]"
            >
              <p className="mt-3 text-md text-[var(--softTextColor)] mb-2 border border-2 border-[var(--softTextColor)] py-2 px-3 rounded-[20px] font-semibold">
                Monthly Plan
              </p>
              <p className="text-xl md:text-2xl mb-2 mt-3 font-semibold text-blue-700 border-b pb-2">
                $4.99/month
              </p>
              <button
                className="mt-6 bg-blue-700 text-white py-3 px-6 w-full rounded-lg font-bold hover:bg-blue-700 transition"
                onClick={() => handleSelectPlan({ name: 'Monthly Plan', price: 4.99 })}
              >
                Start Your 7-days Free Trial
              </button>
            </div>

            {/* Annual Plan */}
            <div
              className="bg-[var(--textColore)] shadow-md rounded-2xl p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg
              border-2 border-[var(--textColore)]"
            >
              <p className="mt-3 text-md text-[var(--softTextColor)] mb-2 border border-2 border-[var(--softTextColor)] py-2 px-3 rounded-[20px] font-semibold">
                Annual Plan
              </p>
              <p className="text-xl md:text-2xl mb-2 mt-3 font-semibold text-blue-700 border-b pb-2">
                $49.99/year
              </p>
              <button
                className="mt-6 bg-blue-700 text-white py-3 px-6 w-full rounded-lg font-bold hover:bg-blue-700 transition"
                onClick={() => handleSelectPlan({ name: 'Annual Plan', price: 49.99 })}
              >
                Start Your 1-month Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';

export default function PropertySwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState(false); // false = forrent, true = forsale
  const [toggleModelState, setToggleModelState] = useState(false); // false = forrent, true = forsale
  const [searchParams, setSearchParams] = useSearchParams();
  const currentModelSale = searchParams.get('forsale');

  const currentModelRent = searchParams.get('forrent');


  const handleModelToggle = () => {
    const newState = !toggleModelState;
    setToggleModelState(newState);
    navigate(location.pathname + `?model=${newState ? 'forsale' : 'forrent'}`);
  };

  const handleClickSale = (model) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('model', model);
    setSearchParams(newParams); // Triggers rerender with updated model param
  };

  const handleClickRent = (model) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('model', model);
    setSearchParams(newParams); // Triggers rerender with updated model param
  };

  const handleToggle = () => {
    const newState = !toggleState;
    setToggleState(newState);
    navigate("/"); // Always go to home when toggling
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const isNotRootPath = location.pathname === "/" && location.search !== "";
  const isRootPathWithoutSearchParams = location.pathname === "/" && !location.search;


  return (
    <div className="w-full border p-3 border-[var(--softBg4)] rounded-xl mb-5 shadow-md flex flex-col items-center ">
        {isNotRootPath && (

        <div className="flex justify-between gap-2 block md:hidden md:gap-4 items-center w-full max-w-sm">
          
          {/* Clickable text */}
          <div  className="cursor-pointer">
            <p onClick={handleGoHome} className="text-md cursor-pointer text-[var(--softTextColor)] font-bold hover:underline">
              Remove all filters
            </p>
            <div className="cursor-pointer flex flex-col justify-between md:hidden">
   <p
  onClick={() => handleClickSale('forsale')}
  className={`text-sm text-[var(--softTextColor)] hover:underline ${
    currentModelSale === 'forsale' ? 'font-bold underline' : ''
  }`}
>
  For Sale
</p>

<p
  onClick={() => handleClickRent('forrent')}
  className={`text-sm text-[var(--softTextColor)] hover:underline ${
    currentModelRent === 'forrent' ? 'font-bold underline' : ''
  }`}
>
  For Rent
</p>
    </div>
          </div>

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleGoHome}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✓" : "✓"}
            </div>
          </div>
        </div>    )}




        <div className="flex justify-between hidden md:flex gap-2 md:gap-4 items-center w-full max-w-sm">
          
          {/* Clickable text */}
          <div onClick={handleGoHome} className="cursor-pointer">
            <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              Remove all filters
            </p>
            <p className="text-sm md:hidden block text-[var(--softTextColor)] font-normal">
              go back home
            </p>
          </div>

          {/* Fancy Toggle Switch */}
          <div
            onClick={handleToggle}
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✓" : "✓"}
            </div>
          </div>
        </div>


        {isRootPathWithoutSearchParams && (

        <div  className="flex justify-between block md:hidden  gap-0 md:gap-4 items-center w-full max-w-sm">
          
          {/* Clickable text */}
          <div>
          <p className="text-md text-[var(--softTextColor)] font-bold hover:underline">
              Buy or rent property
            </p>
            <div className="cursor-pointer flex flex-col justify-between md:hidden">
   <p
  onClick={() => handleClickBuy('forsale')}
  className={`text-sm text-[var(--softTextColor)] hover:underline ${
    currentModel === 'forsale' ? 'font-bold underline' : ''
  }`}
>
  For Sale
</p>

<p
  onClick={() => handleClickRent('forrent')}
  className={`text-sm text-[var(--softTextColor)] hover:underline ${
    currentModel === 'forrent' ? 'font-bold underline' : ''
  }`}
>
  For Rent
</p>
    </div>
      </div>   


          {/* Fancy Toggle Switch */}
          <div
            className="w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[var(--softTextColor)]"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[var(--softTextColor)] rounded-full shadow-md transform duration-300 ease-in-out
                ${toggleModelState ? "translate-x-8 bg-[var(--bg)]" : "translate-x-0 bg-[var(--bg)]"}`}
            >
              {toggleState ? "✓" : "✓"}
            </div>
          </div>
        </div> )}




    </div>
  );
}



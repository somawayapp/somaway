"use client";
import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";

const BackButton = () => {
  return (
    <button
      type="button"
      className="flex flex-row gap-2 items-center text-[15px] font-semibold py-2 px-4 rounded-full hover:bg-neutral-100 transition
       cursor-pointer text-[var(--softTextColor)] "
       onClick={() => window.history.back()}>
    <MdKeyboardBackspace size={18}/>
      <span>
        Back
      </span>
    </button>
  );
};

export default BackButton;

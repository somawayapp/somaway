import { useEffect } from "react";

const ThemeToggler = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return null; // No toggle button since dark mode is fixed
};

export default ThemeToggler;

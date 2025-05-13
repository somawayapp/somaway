import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`w-14 h-8 flex items-center rounded-full px-1 transition-colors duration-300 ${
        isDark ? "bg-gray-700" : "bg-gray-400"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          // Moon icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0112.003 21
              c-5.39 0-9.75-4.36-9.75-9.75a9.715 9.715 0
              016.002-8.994A7.5 7.5 0 0021.752 15z"
            />
          </svg>
        ) : (
          // Sun icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m8.485-8.485h-1M4.515
              12h-1m15.364 4.95l-.707-.707M6.343
              6.343l-.707-.707m12.728 12.728l-.707-.707M6.343
              17.657l-.707-.707M16.242 12a4.242 4.242 0
              11-8.485 0 4.242 4.242 0 018.485 0z"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggler;


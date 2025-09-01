"use client";

import { BiSun, BiMoon } from "react-icons/bi";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 transition"
    >
      {theme === "dark" ? (
        <BiSun className="text-orange-500 w-8 h-8 cursor-pointer" />
      ) : (
        <BiMoon className="text-blue-600 w-8 h-8 cursor-pointer" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggler;

import { useEffect, useState } from "react";
import { MdLightMode, MdOutlineDarkMode } from "react-icons/md";

const Theme = () => {
  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <>
      {theme === "light" ? (
        <MdOutlineDarkMode
          className="text-3xl text-teal-600 cursor-pointer"
          onClick={handleThemeSwitch}
        />
      ) : (
        <MdLightMode
          className="text-3xl cursor-pointer dark:text-white"
          onClick={handleThemeSwitch}
        />
      )}
    </>
  );
};

export default Theme;

import { Button } from '../components/ui/button'
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        setIsDarkMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  if (!isClient) return null;

  return (
    <Button
      aria-label="Toggle theme"
      onClick={() => setIsDarkMode((prev) => !prev)}
      variant="ghost"
      size="icon"
      className="w-5 h-5 transition-all duration-200 hover:bg-transparent !bg-transparent"
    >
      {isDarkMode ? <Moon size={20} className='dark:text-white' /> : <Sun size={20} />}
    </Button>
  );
};

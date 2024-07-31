import { useTheme } from 'next-themes';
import React from 'react';
import { MoonStar, SunDim } from 'lucide-react';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded text-gray-900 dark:text-gray-100"
    >
      {theme === 'light' ? <MoonStar /> : <SunDim />}
    </button>
  );
};

export default ThemeSwitch;
"use client"
import { useTheme } from 'next-themes';
import React from 'react';
import { MoonStar, SunDim } from 'lucide-react';

import {useSound} from "use-sound";
import pop from "../public/audio/pop.mp3";
import clsx from 'clsx';

type ThemeProps = {
  classes?: string
}
const ThemeSwitch = ({classes} : ThemeProps) => {
  const { theme, setTheme } = useTheme();
  const [play] = useSound(pop)

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    play()
  };


  return (
    <button
      onClick={handleClick}
      className={clsx('p-2 rounded text-gray-900 dark:text-gray-100', classes)}
    >
      {theme === 'light' ? <MoonStar /> : <SunDim />}
    </button>
  );
};

export default ThemeSwitch;
"use client";

import { ChartArea, HomeIcon, UserCog2 } from "lucide-react";
import { ThemeToggle } from "@components/themeToggle";
import Link from "next/link";

export const Nav = () => {
  return (
    <nav
      className='flex px-6 py-3 justify-between bg-[#ccc2] dark:bg-[#8882] backdrop-blur-md shadow-lg mt-8 absolute rounded-full lg:w-1/3 top-0 w-4/5 z-20 c-beige:text-beige-800'>
      <h2 className='font-bold '> LeanURL </h2>
      <section className='flex items-center space-x-3'>
        <ThemeToggle />
        <Link href='/share' className='hover:text-blue-500'><HomeIcon className="w-5 h-5" /></Link>
        <Link href='/analytics' className='hover:text-blue-500'><UserCog2 className="w-5 h-5" /></Link>
        <Link href='/graphs' className='hover:text-blue-500'><ChartArea className="w-5 h-5" /></Link>
      </section>
    </nav>
  );
};
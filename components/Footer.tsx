"use client"

import React, { useState } from "react";
import Link from "next/link";
import { HomeIcon, TimerIcon, PenBoxIcon, ShoppingBasket, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const footerItems = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/timer", icon: TimerIcon, label: "Focus Time" },
  { href: "/notes", icon: PenBoxIcon, label: "Notes" },
  { href: "/shop", icon: ShoppingBasket, label: "Shop" },
  { href: "/workbench", icon: Palette, label: "Workbench" },
];

export default function Footer() {
  const [activeItem, setActiveItem] = useState("/");

  return (
    <footer className="mt-auto">
      <div className="mx-auto max-w-sm p-4">
        <nav className="flex items-center justify-between rounded-2xl bg-white/10 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur-lg">
          {footerItems.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center justify-center rounded-xl p-3 transition-all duration-300 ${
                      activeItem === item.href ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                    onClick={() => setActiveItem(item.href)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10"
                    >
                      <item.icon className={`h-6 w-6 transition-colors duration-300 ${
                        activeItem === item.href ? 'text-primary' : 'text-gray-400 group-hover:text-gray-200'
                      }`} />
                    </motion.div>
                    {activeItem === item.href && (
                      <motion.span
                        className="absolute inset-0 rounded-xl bg-primary/20"
                        layoutId="activeBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-primary text-primary-foreground"
                >
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
    </footer>
  );
}
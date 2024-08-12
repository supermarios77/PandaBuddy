import Link from "next/link";

import { HomeIcon, TimerIcon, SettingsIcon, PenBoxIcon, ShoppingBasket, Pencil, Palette } from "lucide-react";

export default function Footer() {
  return (
    <footer>
      <div className="bg-transparent px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-md rounded-xl bg-background shadow-2xl ring-1 ring-gray-900/5">
          <nav className="flex items-center justify-between gap-4 p-4">
            <Link
              href="/"
              className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-indigo-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              prefetch={false}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            <Link
              href="/timer"
              className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              prefetch={false}
            >
              <TimerIcon className="h-6 w-6" />
              <span className="sr-only">Focus Time</span>
            </Link>
            <Link
              href="/notes"
              className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              prefetch={false}
            >
              <PenBoxIcon className="h-6 w-6" />
              <span className="sr-only">Notes</span>
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              prefetch={false}
            >
              <ShoppingBasket className="h-6 w-6" />
              <span className="sr-only">Study</span>
            </Link>
            <Link
              href="/workbench"
              className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              prefetch={false}
            >
              <Palette className="h-6 w-6" />
              <span className="sr-only">Study</span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

import { HomeIcon, TimerIcon, SettingsIcon } from "lucide-react";

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
              href="/settings"
              className="flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              prefetch={false}
            >
              <SettingsIcon className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

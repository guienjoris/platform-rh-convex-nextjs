"use client";

import { useState } from "react";
import Link from "next/link";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        // Conditional class based on isOpen
        // state to control width and visibility
        className={`bg-gray-800 text-white
                    fixed h-screen p-2 transition-all rounded m-2
                    duration-300 z-10
                    ${isOpen ? "w-64 block" : "hidden w-0 overflow-hidden"}`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col items-center">
          <div className="">
            <Link
              href="/"
              className="text-white
                          hover:text-gray-300"
            >
              Accueil
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/planning"
              className="text-white
                          hover:text-gray-300"
            >
              Mon planning
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/request"
              className="text-white
                          hover:text-gray-300"
            >
              Déposer un congé/RTT
            </Link>
          </div>
          {/* Add more sidebar items here */}
        </div>
      </div>
      {/* Main content */}
      <div
        className={`flex-1 p-4
                        ${isOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Button to toggle sidebar */}
        <div className="ml-auto">
          <button
            className="bg-blue-500 hover:bg-blue-700
                       text-white font-bold py-2 px-4 rounded-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Toggle icon based on isOpen state */}
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

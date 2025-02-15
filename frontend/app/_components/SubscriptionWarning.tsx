"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import Link from "next/link";

export default function SubscriptionWarning({
  userType,
}: {
  userType: "organisation" | "individual";
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Box className="bg-red-600 relative w-full">
      <div className=" py-5 px-4 sm:px-6 lg:px-8">
        <div className=" flex  flex-wrap">
          <button
            type="button"
            className="absolute top-0 right-1 p-2 rounded-full bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-500 focus:ring-white"
            onClick={() => setIsVisible(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="w-full flex items-center">
            <span className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </span>
            <p className="mr-auto font-medium text-white truncate">
              <span>Your {userType} subscription has expired </span>
            </p>

            <Link
              href="/pricing"
              className="mr-3 inline-flex ml-5 text-[1.4rem] items-center px-4 py-2 border border-transparent rounded-md shadow-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-500 focus:ring-white"
            >
              Renew
            </Link>
          </div>
        </div>
      </div>
    </Box>
  );
}

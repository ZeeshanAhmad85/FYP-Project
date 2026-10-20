"use client";
import React, { useEffect } from "react";
import { Link } from "react-transition-progress/next";
import { TriangleAlert } from "lucide-react";
const Error: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl h-screen flex items-center justify-center lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <TriangleAlert className="w-[100px] h-[100px] text-primary dark:text-primary mx-auto" />

          <p className="my-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            {"Something's Went wrong."}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we will fix in a minute.
          </p>
          <Link
            href="/"
            className="inline-flex text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Error;

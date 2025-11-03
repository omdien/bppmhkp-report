"use client";
import React from "react";

interface ChartBoxProps {
  title: string;
  children: React.ReactNode;
}

const ChartBox: React.FC<ChartBoxProps> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-[360px] flex flex-col justify-between transition-colors duration-300">
    <h4 className="text-center text-gray-700 dark:text-gray-200 font-semibold mb-2">
      {title}
    </h4>
    <div className="flex-1 flex items-center justify-center">{children}</div>
  </div>
);

export default ChartBox;
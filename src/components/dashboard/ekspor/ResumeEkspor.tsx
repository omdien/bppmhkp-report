"use client";
import React from "react";
import Badge from "../../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, FrekIcon, RpIcon, UsdIcon } from "@/icons";

export const ResumeEkspor = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Frekuensi Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Top section: icon + label side by side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FrekIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Frekuensi
          </span>
        </div>

        {/* Bottom section: number + badge */}
        <div className="flex items-end justify-between mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            3,782
          </h4>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!--Frekuensim End --> */}

      {/* <!-- Volume Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Top section: icon + label side by side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Volume
          </span>
        </div>

        {/* Bottom section: number + badge */}
        <div className="flex items-end justify-between mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            5,359
          </h4>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Volume End --> */}

      {/* <!-- Nilai IDR Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Top section: icon + label side by side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <RpIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Nilai IDR
          </span>
        </div>

        {/* Bottom section: number + badge */}
        <div className="flex items-end justify-between mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            5,359
          </h4>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Nilai IDR End --> */}

      {/* <!-- Nilai USD Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Top section: icon + label side by side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <UsdIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Nilai USD
          </span>
        </div>

        {/* Bottom section: number + badge */}
        <div className="flex items-end justify-between mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            5,359
          </h4>
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Nilai USD End --> */}
    </div>
  );
};

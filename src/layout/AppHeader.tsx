"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { usePeriode } from "@/context/PeriodeContext";
import PeriodePicker from "@/components/common/PeriodePicker";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "/public/images/logo.png";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { periode, setPeriode } = usePeriode(); // ambil context periode

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // handler untuk PeriodePicker
  const handlePeriodeSubmit = (newPeriode: { startDate: string; endDate: string }) => {
    setPeriode(newPeriode); // update context → semua komponen otomatis update
  };

  return (
    <header className="sticky top-0 z-99999 flex w-full border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        {/* LEFT SECTION */}
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 lg:h-11 lg:w-11 lg:border lg:border-gray-200 dark:lg:border-gray-800"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 0 1 1.06-1.06L12 10.94l4.72-4.72a.75.75 0 0 1 1.06 1.06L13.06 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L10.94 12 6.22 7.28Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="16" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M.58 1A.75.75 0 0 1 1.33.25h13.33c.41 0 .75.34.75.75s-.34.75-.75.75H1.33A.75.75 0 0 1 .58 1ZM.58 11a.75.75 0 0 1 .75-.75h13.33c.41 0 .75.34.75.75s-.34.75-.75.75H1.33a.75.75 0 0 1-.75-.75ZM1.33 5.25a.75.75 0 0 0 0 1.5h6.67a.75.75 0 0 0 0-1.5H1.33Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* Logo (mobile) */}
          <Link href="/dashboard" className="lg:hidden">
            <div className="flex items-center space-x-2">
              <Image src={logo} alt="Logo BPPMHKP" width={40} height={40} priority />
              <div className="text-2xl font-bold sm:text-3xl">
                <span className="text-blue-600">BPP</span>
                <span className="text-orange-500">MHKP</span>
              </div>
            </div>
          </Link>

          {/* Application Menu (mobile) */}
          <button
            onClick={() => setApplicationMenuOpen((prev) => !prev)}
            className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm12 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Periode Picker (desktop) */}
          <div className="hidden lg:block">
            <PeriodePicker
              startDate={periode.startDate}  // ambil dari context
              endDate={periode.endDate}      // ambil dari context
              onSubmit={handlePeriodeSubmit} // update context saat klik "Terapkan"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"} w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

"use client";
import Link from "next/link";
import React from "react";
import { navLinks } from "@/constant/constant";
import { HiBars3BottomRight } from "react-icons/hi2";
import ThemeToggler from "@/components/Helper/ThemeToggler";
import Image from "next/image"
import logo from "/public/images/logo.png"

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [navBg, setNavBg] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) {
        setNavBg(true);
      } else {
        setNavBg(false);
      }
    }
    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    }
  }, []);

  return (
    <div className={`transition-all ${navBg ? "bg-slate-200 shadow-md" : "fixed"} duration-200 h-[12vh] z-[100] fixed w-full`}>
      <div className="flex items-center justify-between h-full sm:w-[80%] w-[90%] mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl font-bold sm:text-3xl">
          <Image
            // src="/images/logo.png"
            src={logo}
            alt="Logo BPPMHKP"
            width={40} // sesuaikan ukuran
            height={40}
            priority
          />
          <div>
            <span className="text-blue-600">BPP</span>
            <span className="text-orange-500">MHKP</span>
          </div>
        </div>
        {/* Navlinks */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.id}
                href={link.href}
                className="text-blue-600 hover:text-orange-500 font-semibold transition-colors duration-200"
              >
                <p>{link.label}</p>
              </Link>
            );
          })}
        </div>
        {/* buttons */}
        <div className="flex items-center space-x-4">
          {/* <a
            href="#_"
            className="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-emerald-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300 ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none"
          >
            <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="relative z-20 flex items-center text-sm">
              <FaShoppingBag className="mr-2" />
              Drive
            </span>
          </a> */}

          {/* theme switch button */}
          <ThemeToggler />
          {/* burger menu */}
          <HiBars3BottomRight
            onClick={openNav}
            className="w-8 h-8 cursor-pointer text-blue-500 lg:hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;

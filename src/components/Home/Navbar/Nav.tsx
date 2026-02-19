"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { navLinks } from "@/constant/constant";
import { HiBars3BottomRight } from "react-icons/hi2";
import ThemeToggler from "@/components/Helper/ThemeToggler";
import Image from "next/image";
import logo from "/public/images/logo.png";
import { useRouter } from "next/navigation";

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const [navBg, setNavBg] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) setNavBg(true);
      else setNavBg(false);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        setLoggedIn(res.ok);
      } catch {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <div
      className={`transition-all ${navBg ? "bg-slate-200 shadow-md" : "fixed"
        } duration-200 h-[12vh] z-[9999] fixed w-full`}
    >
      <div className="flex items-center justify-between h-full sm:w-[80%] w-[90%] mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl font-bold sm:text-3xl">
          <Image
            src={logo}
            alt="Logo BPPMHKP"
            width={40}
            height={40}
            priority
          />
          {/* <div>
            <span className="text-blue-600">BPP</span>
            <span className="text-orange-500">MHKP</span>
          </div> */}
          <div className="flex flex-col justify-center leading-tight">
            <div className="text-[25px] font-extrabold leading-none">
              <span className="text-blue-600">BPP</span>
              <span className="text-orange-500">MHKP</span>
            </div>
            <div
              className="text-[14px] font-typewriter font-semibold 
                 text-gray-500 dark:text-gray-300 tracking-wide mt-[2px] leading-none"
            >
              R  e  p  o  r  t
            </div>
          </div>
        </div>
        {/* Navlinks */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-blue-600 hover:text-orange-500 font-semibold transition-colors duration-200"
            >
              <p>{link.label}</p>
            </Link>
          ))}
        </div>

        {/* buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggler />

          {/* login button */}
          {!loading && (
            <button
              onClick={() =>
                router.push(loggedIn ? "/dashboard" : "/login")
              }
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {loggedIn ? "Dashboard" : "Login"}
            </button>
          )}

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

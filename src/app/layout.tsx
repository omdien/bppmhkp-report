"use client";

import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { usePathname } from "next/navigation";
import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import { UserProvider } from "@/context/UserContext";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Hanya tampilkan navbar di halaman publik (bukan dashboard)
  // const showNavbar = !pathname.startsWith("/dashboard") && !pathname.startsWith("/login");
  const showNavbar = pathname === "/";

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <UserProvider>
                {showNavbar && <ResponsiveNav />}
              {children}
            </UserProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

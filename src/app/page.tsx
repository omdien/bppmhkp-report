// import Link from "next/link";

// export default function LandingPage() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold">Selamat Datang 🚀</h1>
//       <p className="mt-4 text-lg text-gray-600">
//         Ini adalah landing page sebelum login.
//       </p>
//       <Link
//         href="/login"
//         className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//       >
//         Login
//       </Link>
//     </main>
//   )
// }

import Home from '@/components/Home/Home';
import React from 'react';

const HomePage = () => {
  return (
    <>
      <Home />
    </>
  );
}

export default HomePage;
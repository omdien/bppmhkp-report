import React from 'react';
import Hero from './Hero';
import Features from './Features';
import PetaIndonesia from './Map';
// Import Provider-nya
import { PeriodeProvider } from "@/context/PeriodeContext";

const Home = () => {
  return (
    // ✅ Bungkus di sini agar semua komponen di dalamnya bisa akses context
    <PeriodeProvider>
      <div className='overflow-hidden'>
        <PetaIndonesia />
        <Hero />
        <Features />
      </div>
    </PeriodeProvider>
  );
}

export default Home;
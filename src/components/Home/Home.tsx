import React from 'react';
import Hero from './Hero';
import Features from './Features';
import PetaIndonesia from './Map';

const Home = () => {
  return (
    <div  className='overflow-hidden'>
      <PetaIndonesia />
      <Hero />
      <Features />
    </div>
  );
}

export default Home
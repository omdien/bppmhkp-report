import React from 'react';
import { FaFingerprint } from 'react-icons/fa';
import { HiOutlineChat } from 'react-icons/hi';
import { IoAppsOutline, IoWifiOutline } from 'react-icons/io5';
import { MdNotifications, MdOutlineTouchApp } from 'react-icons/md';

const Features = () => {
  const featureData = [
    { id: 1, title: 'PPM', description: 'Permohonan Pelayanan Mutu', icon: <MdOutlineTouchApp className='w-12 h-12 text-orange-500 mx-auto' /> },
    { id: 2, title: 'HONEST', description: 'HACCP Online System', icon: <FaFingerprint className='w-12 h-12 text-orange-500 mx-auto' /> },
    { id: 3, title: 'REGMITRA', description: 'Registrasi Negara Mitra', icon: <HiOutlineChat className='w-12 h-12 text-orange-500 mx-auto' /> },
    { id: 4, title: 'SILAB', description: 'Sistem Pengelolaan Bahan Laboratorium', icon: <MdNotifications className='w-12 h-12 text-orange-500 mx-auto' /> },
    { id: 5, title: 'SKP-ONLINE', description: 'Sertifikat Kelayakan Pengolahan', icon: <IoWifiOutline className='w-12 h-12 text-orange-500 mx-auto' /> },
    { id: 6, title: 'SIMONA', description: 'Sistem Monitoring Anggaran', icon: <IoAppsOutline className='w-12 h-12 text-orange-500 mx-auto' /> },
  ];

  return (
    <div id="fitur" className='pt-16 pb-16 scroll-mt-22 sm:scroll-mt-0'>
      <div className='w-[80%] mx-auto'>
        {/* Heading */}
        <h2 className='text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10'>
          Fitur Layanan
        </h2>

        {/* Grid of features */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          {featureData.map(feature => (
            <div key={feature.id} className='text-center mx-auto'>
              <div className='mx-auto text-center'>
                {feature.icon}
              </div>
              <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-white'>{feature.title}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-300 mt-4'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;

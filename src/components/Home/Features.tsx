import React from "react";
import {
  FaFish,
  FaSeedling,
  FaBox,
  FaCapsules,
  FaShip,
  FaTruck,
  FaCertificate,
  FaShieldAlt,
  FaAward,
} from "react-icons/fa";

const Features = () => {
  const featureData = [
    {
      id: 1,
      title: "CPIB",
      description: "Cara Pembenihan Ikan yang Baik",
      icon: <FaSeedling className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 2,
      title: "CBIB",
      description: "Cara Budi Daya Ikan yang Baik",
      icon: <FaFish className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 3,
      title: "CPPIB",
      description: "Cara Pembuatan Pakan Ikan yang Baik",
      icon: <FaBox className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 4,
      title: "CPOIB",
      description: "Cara Pembuatan Obat Ikan yang Baik",
      icon: <FaCapsules className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 5,
      title: "CBIB KAPAL",
      description: "Cara Penanganan Ikan yang Baik di Atas Kapal",
      icon: <FaShip className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 6,
      title: "CDOIB",
      description: "Cara Distribusi Obat Ikan yang Baik",
      icon: <FaTruck className="w-12 h-12 text-orange-500 mx-auto" />,
    },
  ];

  const featureData2 = [
    {
      id: 1,
      title: "SKP",
      description: "Sertifikat Kelayakan Pengolahan",
      icon: <FaCertificate className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 2,
      title: "HACCP",
      description: "Hazard Analysis Critical Control Point",
      icon: <FaShieldAlt className="w-12 h-12 text-orange-500 mx-auto" />,
    },
    {
      id: 3,
      title: "SMKHP",
      description: "Sertifikasi Mutu Hasil Perikanan",
      icon: <FaAward className="w-12 h-12 text-orange-500 mx-auto" />,
    },
  ];

  return (
    <div
      id="fitur"
      className="w-full min-h-screen pt-36 pb-16 scroll-mt-22 sm:scroll-mt-0 bg-gray-50 dark:bg-gray-900 transition-colors"
    >
      <div className="w-[85%] mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Fitur Layanan
        </h2>

        {/* Bagian Produk Primer */}
        <h5 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Sertifikasi Mutu Produk Primer
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featureData.map((feature) => (
            <div
              key={feature.id}
              className="text-center mx-auto p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm"
            >
              <div>{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bagian Pasca Panen */}
        <h5 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10 mt-16">
          Sertifikasi Mutu Pasca Panen
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featureData2.map((feature) => (
            <div
              key={feature.id}
              className="text-center mx-auto p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm"
            >
              <div>{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

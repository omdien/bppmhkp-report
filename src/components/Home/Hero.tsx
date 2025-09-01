'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import imaga_bppmhkp from "/public/images/bppmhkp-logo.png";
import { useRouter } from 'next/navigation';

const Hero = () => {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

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
        <div className='relative w-full h-screen flex justify-center flex-col bg-slate-100'>
            <div className='w-[90%] md:w-[80%] mx-auto items-center grid grid-cols-1 xl:grid-cols-2 gap-6'>

                {/* image content for mobile */}
                <div className='xl:hidden w-full flex justify-center mt-30 mb-2'>
                    <div className='bg-white rounded-3xl shadow-lg py-4 px-10 w-6/8 max-w-xs'>
                        <Image src='/images/bppmhkp-logo.png' alt='image' width={300} height={300} className='mx-auto' />
                    </div>
                </div>

                {/* text content */}
                <div>
                    {/* heading */}
                    <h1 className='text-3xl md:text-4xl text-blue-600 lg:text-5xl mt-6 mb-6 font-bold leading-[2.5rem] md:leading-[3.5rem]'>
                        Aplikasi Report BPPMHKP
                    </h1>

                    {/* description */}
                    <p className='text-xs sm:text-sm md:text-base font-medium text-gray-700'>
                        Aplikasi yang menampilkan dashboard dan laporan dari aplikasi Siapmutu BPPMHKP, terdiri dari Dashboard & report Sertifikat Mutu Hasil Kelautan dan Perikanan (SMKHP), Dashboard & report Sertifikasi Pusat Primer, Dashboard & report Sertifikasi Pusat Pasca Panen
                    </p>

                    {/* button group */}
                    <div className='mt-8 flex flex-col sm:flex-row w-fit sm:items-center space-y-4 sm:space-y-0 sm:space-x-4'>
                        {/* first button */}
                        {!loading && (
                            <button
                                onClick={() => router.push(loggedIn ? "/dashboard" : "/login")}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                {loggedIn ? "Masuk ke Dashboard" : "Login"}
                            </button>
                        )}
                    </div>
                </div>

                {/* image content for desktop */}
                <div className='mx-auto hidden xl:block rounded-3xl shadow-lg p-6'>
                    <Image src={imaga_bppmhkp} alt='image' width={380} height={380} />
                </div>
            </div>
        </div >
    );
}

export default Hero;

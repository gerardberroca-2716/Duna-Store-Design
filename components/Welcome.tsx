import React, { useState } from 'react';
import { DunaStoreLogo } from './Logo';
import { Button } from './ui';
import { Tab } from '../types';

const inspirationalImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCAIfLG1-Yrx0RNwQRAZDv0i2tDun1rBFAnMgRCqqVKTMSCN0xT-Cs_7Nh1Usou739LxYzlHAg5iJM8-fSrA-VnFCTcDeX8942wV_N0EoSutmgNHLZjrWkSP36UjDeG-py_uzRndUBTXKZmI9ytuUX3hyzmtr6_ZV-CwSSrV2YggBnPaySc8dIhAlj2PPm2BPWupNkI1dby33QR_S-jYi4ryJxTMHc0obrnX7Nj-qF0dmApKYI00rOB2Re3XESNq0ddYZBpgbcZHao",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBLwxdy1lGjofoXCyW16CqGtLogt3vExUWBjXCYoPGQqFABn2TUkfI9zvWdjtA5FTSK1wuIbPYYNuHY0wb363bzl6NbpwA755ro4sZ41bWNXKOE7CsJEFQOqM_V3auoUjEU7kgpyIlBvkj7yUh22zbHCVswNf8HO5skvN0w5sNTd2nDvxDr4IyW9F7aFNchVp6rT6pmze7U-NGP5cr1sGS0Cau-2G0sBCSYdqYwgeCGZ0L3dK6yMpeAEd21s5MkIAg-w7k0ewg7DM4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwg1whTVygX5JqfgC8Rp0laQNg229C2Gyb0H6SB7iS43Uy2sIjm7Yu6yZgL5ri0D6CiHN9mlV4EfWXs6HkLVQ-AXi4ku8pJHma9Z2OssZPqNl9c3eyJ5SjVjMV07HXAXlqPjSZm7HyQQDW8BsiKzmdHBdkna6-ijyo3ciqGEpYpU8MuFTW-1I8MfdIQoJ9y9t3J3hAuC3K3XeY43bsPAwV84h7rqR3k2c0T_oP31_RJ1HqCRDvpaAx2Z_2vMQ4tztOzIm0Zpu43x0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBxlstC8bZlu7XsPNyw7oFyQxGawrE4MXJrvyryjCWUGf0ZP06ZOBE2CPWQBIyT5sLdNZv1B_YAMQTd4RGlXOnZPv1ow-tO9DkzGOMvmtzXnck2cf_GEbZVl7ZFoegzA-xiKukzARqB8CWjQcBwUy-_y-oeNX-Yh_xD44fyJ7HTJmxZfB3nmFJS65OyvRfg9NCM7FP78YTJBSBnvL4ifXqYIULfTeUrTCQ1Etyd2YVqQAB3nPkRkin1IbS9wZA4SqbelVJPCAMaTKY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0CIPSEre3DG0Mf-V28R3SpmK14tg4i31WlNaVTp5KTdDT22Cyx7K2VwdTFWL4faR95EMQJVa8An2WuV-mXD87J7_b3kiyo67EQHgHwk0feQ6YhTWy_rEXc5BWBEpwS-RkuVdPZn0a271zg8ka0BUx9s9rdm8D7Lz_Tf-3GNth2lpX4fJ32DjTMF1fZrGuvi22j6ZOB8DHQ2RbNSTX_Nnw1FbredjeiZbU3tMF_25PRu52Tbn8-stGlRDSbrrzcd4nrszkr22NlS0"
];

const toolButtons = [
    { tab: Tab.MagicCleaner, icon: 'auto_fix_high' },
    { tab: Tab.VirtualModels, icon: 'person' },
    { tab: Tab.AdCreator, icon: 'campaign' },
    { tab: Tab.BackgroundCreator, icon: 'wallpaper' }
];

interface WelcomeProps {
    setActiveTab: (tab: Tab) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ setActiveTab }) => {
    const [showTools, setShowTools] = useState(false);

    return (
        <div className="p-8 flex flex-col items-center justify-center text-center h-full overflow-hidden bg-white dark:bg-transparent">
            <div className="w-48 h-auto mb-6">
                <DunaStoreLogo />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-primary-light dark:text-text-primary-dark">
                Bienvenido a Duna Store Studio
            </h1>
            <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
                Tu centro de creación IA para marketing visual de alto impacto. Transforma tus productos en obras de arte listas para vender.
            </p>
            
            <div className="mt-8 transition-all duration-500 w-full max-w-md">
                {!showTools ? (
                    <div className="p-1 rounded-lg bg-primary-gradient shadow-lg shadow-primary/30">
                         <button 
                            onClick={() => setShowTools(true)}
                            className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 bg-background-light dark:bg-surface-dark text-primary-dark dark:text-white hover:bg-transparent hover:text-white"
                        >
                             <span className="material-symbols-outlined mr-2">play_circle</span>
                            Empezar a Crear
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                        {toolButtons.map(({ tab, icon }) => (
                             <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-100 dark:bg-surface-dark/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-300 hover:scale-105"
                            >
                                <span className="material-symbols-outlined text-3xl">{icon}</span>
                                <span className="font-semibold text-sm">{tab}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-12 w-full max-w-6xl relative">
                <p className="text-sm font-bold tracking-widest uppercase text-text-secondary-light dark:text-text-secondary-dark/50 mb-4">INSPIRACIÓN</p>
                <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-background-light dark:from-background-dark via-transparent to-background-light dark:to-background-dark z-10 pointer-events-none"></div>
                    <div className="absolute top-0 left-0 flex animate-scroll">
                        {[...inspirationalImages, ...inspirationalImages].map((src, index) => (
                             <div key={index} className="w-48 mx-4 flex-shrink-0">
                                <img src={src} className="w-full h-64 object-cover rounded-xl shadow-2xl shadow-black/30" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>

        </div>
    );
}

export default Welcome;
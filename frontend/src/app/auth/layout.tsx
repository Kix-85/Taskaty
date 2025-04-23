import React from "react";
import "../globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auth",
    description: "Login or Register to access the app",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen  w-full">
            <main className="flex h-full items-center justify-center bg-gradient-to-r from-zinc-900 to-indigo-900 p-4">
                <div className="w-full max-w-md lg:max-w-6xl backdrop-filter backdrop-blur-sm border border-indigo-900/30 shadow-xl rounded-xl grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Panel - Hidden on mobile */}
                    <div className="hidden lg:flex flex-col justify-center items-start rounded-lg p-8 bg-gradient-to-br from-indigo-900/50 to-zinc-900/80 text-white">
                        <div className="space-y-4">
                            <h1 className="text-2xl xl:text-3xl font-bold leading-tight">
                                Welcome Back <br />
                                <span className='bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>Dear Friend</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-300">
                                We take pride in offering unparalleled customer support to ensure your experience with our platforms
                            </p>
                            <div className="flex items-center gap-2 text-blue-300 text-xs sm:text-sm">
                                <span>Over 2,568+ Designers & Creators Love Our Platform</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Panel - Form */}
                    <div className="p-2 flex items-center justify-center bg-white/5">
                        <div className="w-full max-w-xs sm:max-w-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
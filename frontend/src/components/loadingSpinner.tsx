import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute top-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700">Loading your page...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
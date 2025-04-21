import React from 'react'

const GoogleSignUp = () => {
    return (
        <button className="relative overflow-hidden group flex items-center w-full justify-center gap-3 px-6 py-3 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-white/10 text-white">
            {/* Google Icon */}
            <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.156-2.685-6.735-2.685-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z"></path>
            </svg>

            <span className="text-white font-medium">Sign Up With Google Account</span>

            {/* Glassmorphism effect elements */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-45"></span>
        </button>
    )
}

export default GoogleSignUp
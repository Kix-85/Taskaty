"use client";

type InputProps = {
    label: string,
    placeholder: string,
    type: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string
}

const InputWithLabel = ({ label, type = "text", onChange, placeholder, className = "" }: InputProps) => {
    return (
        <label className={`w-full flex flex-col mb-4 text-sm font-medium text-gray-200 ${className}`}>
            {label}
            <input
                type={type}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-white/50 transition-all"
            />
        </label>
    );
};

export default InputWithLabel;
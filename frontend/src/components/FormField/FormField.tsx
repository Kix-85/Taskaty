type InputProps = {
    label: string,
    placeholder: string,
    type: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    name: string
}

const FormField = ({ label, type = "text", onChange, placeholder }: InputProps) => {
    return (
        <label className="w-full flex flex-col mb-4 text-sm font-medium text-gray-200">
            {label}
            <input
                type={type}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full mt-1 px-3 py-2 border border-gray-500 rounded-2xl focus:outline-none focus:ring ring-indigo-950"
                name={name} // Convert label to lowercase and remove spaces for the name attribute
            />
        </label>
    );
};
export default FormField;  
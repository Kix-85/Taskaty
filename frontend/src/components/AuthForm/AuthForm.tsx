"use client";

<<<<<<< HEAD
import TextField from "@mui/material/TextField";
=======
import FormField from '../FormField/FormField';
>>>>>>> fbd7e5d3a69b8ddf1405324362846369642f2365
import Button from '@mui/material/Button';
import GoogleSignUp from '../GoogleSignUpBtn/GoogleSignUpBtn';

type AuthFormProps = {
    auth: string,
    changeView: (e: string) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AuthForm = ({ auth, onChange, changeView }: AuthFormProps) => {
    return (
        <form className="w-full max-w-md flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
            <h1 className='mb-4 text-white font-bold text-xl sm:text-2xl text-center'>
                {auth === 'login' ? 'Sign In To Your Account' : 'Create Your Account'}
            </h1>

            <div className="w-full space-y-4">
                {auth === 'register' && (
                    <FormField 
                        label="Full Name" 
                        type="text" 
                        placeholder="Enter your full name" 
                        onChange={onChange} 
                    />
                )}
                <FormField 
                    label="Email" 
                    type="email" 
                    placeholder="Enter your email" 
                    onChange={onChange} 
                />
                <FormField 
                    label="Password" 
                    type="password" 
                    placeholder="Enter your password" 
                    onChange={onChange} 
                />
            </div>

            <Button 
                variant='contained' 
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
                {auth === 'login' ? 'Sign In' : 'Register'}
            </Button>

            <div className="w-full mt-4 text-center">
                {auth === 'login' ? (
                    <p className='text-gray-300'>
                        Don't have an account?{' '}
                        <span 
                            onClick={() => changeView('register')} 
                            className='text-cyan-400 hover:underline cursor-pointer'
                        >
                            Register Here
                        </span>
                    </p>
                ) : (
                    <p className='text-gray-300'>
                        Already have an account?{' '}
                        <span 
                            onClick={() => changeView('login')} 
                            className='text-cyan-400 hover:underline cursor-pointer'
                        >
                            Sign In
                        </span>
                    </p>
                )}
            </div>

            <div className="w-full mt-6">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 bg-transparent text-sm text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </div>
                <GoogleSignUp />
            </div>
        </form>
    );
};

export default AuthForm;
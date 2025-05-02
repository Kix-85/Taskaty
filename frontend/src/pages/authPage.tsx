import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm/AuthForm';

const AuthPage = () => {
  const { auth } = useParams<{ auth: 'login' | 'register' }>();
  const [currentAuth, setCurrentAuth] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (auth === 'login' || auth === 'register') {
      setCurrentAuth(auth);
    }
  }, [auth]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentAuth === 'login') {
      // Handle login logic here
      console.log('Logging in with:', formData);
    } else {
      // Handle registration logic here
      console.log('Registering with:', formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <AuthForm
        auth={currentAuth}
        changeView={setCurrentAuth}
        onChange={handleInputChange}
        submitForm={handleSubmit}
      />
    </div>
  );
};

export default AuthPage;

"use client";

import { useState } from 'react';
import AuthForm from '@/components/AuthForm/AuthForm';

const Authentication = () => {
    const [view, setView] = useState("login");

    const handleView = (e: string) => {
        setView(e);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <AuthForm 
            auth={view} 
            onChange={() => {}} 
            changeView={handleView}
        />
    );
};

export default Authentication;
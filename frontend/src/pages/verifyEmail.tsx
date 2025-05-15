import { useLocation } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const status = query.get('status');
    const reason = query.get('reason');

    let icon = null;
    let message = '';
    let bgColor = '';

    if (status === 'success') {
        icon = <CheckCircle className="text-green-600 w-10 h-10" />;
        message = 'Your account has been successfully verified!';
        bgColor = 'bg-green-100 border-green-500 text-green-700';
    } else if (status === 'already-verified') {
        icon = <AlertTriangle className="text-yellow-500 w-10 h-10" />;
        message = 'Your account is already verified.';
        bgColor = 'bg-yellow-100 border-yellow-500 text-yellow-700';
    } else if (status === 'error') {
        icon = <XCircle className="text-red-600 w-10 h-10" />;
        if (reason === 'user-not-found') {
            message = 'Verification failed: User not found.';
        } else if (reason === 'invalid-or-expired-token') {
            message = 'Verification failed: Token is invalid or has expired.';
        } else {
            message = 'Verification failed due to an unknown error.';
        }
        bgColor = 'bg-red-100 border-red-500 text-red-700';
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className={`border-l-4 p-6 rounded-md shadow-md max-w-lg w-full ${bgColor}`}>
                <div className="flex items-center gap-4">
                    {icon}
                    <div className="text-lg font-medium">{message}</div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;

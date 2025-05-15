import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';
import LoadingSpinner from '@/components/loadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactElement;
    adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
    const { user, isAuthenticated, setUser, isLoading, setIsLoading } = useAuthStore();
    const navigate = useNavigate();
    console.log('User is: ',user)
    console.log('isLoading: ', isLoading)
    useEffect(() => {
        console.log("Enter useEffect")
        const fetchUser = async () => {
            console.log("Enter fetchUser")
            try {
                console.log("Enter fetchUser tryBlock")
                if (!user) {
                    setIsLoading(true);
                    console.log('Fetching user data...');
                    const res = await userService.verifyToken();
                    console.log('Response from verifyToken:', res);
                    if (res.status === 200) {
                        setUser(res.data.user);
                    } else {
                        setUser(null);
                        console.log('User not authenticated, navigating to /auth....');
                        navigate('/auth');
                    }
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setUser(null);
                navigate('/auth');
            } finally {
                console.log("Enter fetchUser finallyBlock")
                setIsLoading(false);
            }
        };

        console.log("Should call this function")
        // Only fetch if not authenticated
        if (!isAuthenticated) {
            console.log("Enter fetchUser ifBlock")
            fetchUser();
        }
        console.log("The end of useEffect")
    }, [user, isAuthenticated, setUser, setIsLoading, navigate, isLoading]);

    if (isLoading) return <LoadingSpinner />; 

    console.log("Still loading? ", isLoading)
    console.log("User: ", user)
    // Check if the user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;

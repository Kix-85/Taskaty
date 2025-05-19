import api from "@/lib/axios"
import Cookies from 'js-cookie';

export const authService = {
    sign: async (endpoint: string, data: any) => {
        try {
            const res = await api.post(`/auth/${endpoint}`, data);
            console.log('Response From Auth Service:', res.data);
            
            // If login was successful and we received a token
            if (res.data.token) {
                // Store token in cookie
                Cookies.set('token', res.data.token, { 
                    expires: 1, // 1 day
                    secure: true,
                    sameSite: 'strict'
                });
            }
            
            return res;
        } catch (error) {
            throw error; 
        }
    },

    logout: async () => {
        try {
            const res = await api.post('/auth/logout');
            // Clear token on logout
            Cookies.remove('token');
            return res;
        } catch (error) {
            throw error; 
        }
    },

    // Helper method to get current token
    getToken: () => {
        return Cookies.get('token');
    },

    // Verify token with backend
    verifyToken: async (token: string) => {
        try {
            const res = await api.post('/auth/verify-token', { token });
            if (res.data.token) {
                // Store token in cookie
                Cookies.set('token', res.data.token, {
                    expires: 1,
                    secure: true,
                    sameSite: 'strict'
                });
                
                // Set token in axios default headers
                api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            }
            return res;
        } catch (error) {
            // Clear token on verification failure
            Cookies.remove('token');
            delete api.defaults.headers.common['Authorization'];
            throw error;
        }
    },

    // Initialize auth state
    initializeAuth: async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const res = await authService.verifyToken(token);
                if (res.data.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                    return res.data.user;
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                Cookies.remove('token');
                delete api.defaults.headers.common['Authorization'];
            }
        }
        return null;
    }
}
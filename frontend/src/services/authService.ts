import api from "@/lib/axios"

export const authService = {
    sign: async (endpoint, data) => {
        try {
            const res = await api.post(`/auth/${endpoint}`, data);
            console.log('Response From Auth Service:', res.data);
            return res;
        } catch (error) {
            throw error; // Let the caller handle the error properly
        }
    },

    logout: async () => {
        try {
            const res = await api.post('/auth/logout');
            return res;
        } catch (error) {
            throw error; // Let the caller handle the error properly
        }
    }
}
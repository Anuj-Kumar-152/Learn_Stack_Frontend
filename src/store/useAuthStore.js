import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '../api/axiosConfig';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // true initially to allow checkAuth to run
    mfaEmail: null,  // stores email temporarily during the MFA flow

    // Actions
    setMfaEmail: (email) => set({ mfaEmail: email }),

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        
        // If MFA and Verification are not required, we instantly log the user in
        if (response.data.success && !response.data.requireMFA && !response.data.requireVerification) {
            const { token, refreshToken, user } = response.data;
            const isSecure = window.location.protocol === 'https:';
            Cookies.set('token', token, { expires: 30, secure: isSecure, sameSite: 'strict' });
            if (refreshToken) {
                Cookies.set('refreshToken', refreshToken, { expires: 30, secure: isSecure, sameSite: 'strict' });
            }
            set({ user, isAuthenticated: true });
        }
        
        return response.data; // { success, requireMFA, email, message }
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data; 
    },

    toggleMFA: async (isMFA) => {
        const response = await api.put('/auth/toggle-mfa', { isMFA });
        set((state) => ({
            user: { ...state.user, isMFA: response.data.isMFA }
        }));
        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        const { token, refreshToken, user } = response.data;
        
        // Store token in cookies securely
        const isSecure = window.location.protocol === 'https:';
        Cookies.set('token', token, { expires: 30, secure: isSecure, sameSite: 'strict' });
        if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { expires: 30, secure: isSecure, sameSite: 'strict' });
        }
        
        set({ user, isAuthenticated: true, mfaEmail: null });
        return response.data;
    },

    resendOtp: async (email) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },

    checkAuth: async () => {
        set({ isLoading: true });
        const token = Cookies.get('token');
        
        if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
        }

        try {
            // The axios interceptor will automatically attach the token
            const response = await api.get('/auth/me');
            if (response.data && response.data.data) {
                set({ user: response.data.data, isAuthenticated: true });
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        set({ user: null, isAuthenticated: false, mfaEmail: null });
    }
}));

// Listen for the custom event from axios interceptor
window.addEventListener('auth_unauthorized', () => {
    useAuthStore.getState().logout();
});

export default useAuthStore;

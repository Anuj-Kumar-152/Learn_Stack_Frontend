import { create } from 'zustand';
import api from '../api/axiosConfig';

const useProfileStore = create((set, get) => ({
    profiles: [],
    currentProfile: null,
    isLoading: false,
    error: null,

    getMyProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/profiles/me');
            set({ currentProfile: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch your profile' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getProfileByUserId: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/profiles/user/${userId}`);
            set({ currentProfile: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch user profile' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createProfile: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            // FormData for avatar upload
            const response = await api.post('/profiles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set({ currentProfile: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create profile' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/profiles/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set({ currentProfile: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update profile' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProfile: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/profiles/${id}`);
            set({ currentProfile: null });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete profile' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useProfileStore;

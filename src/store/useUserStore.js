import { create } from 'zustand';
import api from '../api/axiosConfig';

const useUserStore = create((set, get) => ({
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,

    setLoading: (status) => set({ isLoading: status }),
    setError: (error) => set({ error }),

    getAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/users');
            set({ users: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch users' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getUserById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/users/${id}`);
            set({ currentUser: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch user' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/users', userData);
            set((state) => ({ users: [...state.users, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create user' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateUser: async (id, userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/users/${id}`, userData);
            set((state) => ({
                users: state.users.map(u => u._id === id ? response.data.data : u),
                currentUser: state.currentUser?._id === id ? response.data.data : state.currentUser
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update user' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/users/${id}`);
            set((state) => ({
                users: state.users.filter(u => u._id !== id),
                currentUser: state.currentUser?._id === id ? null : state.currentUser
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete user' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useUserStore;

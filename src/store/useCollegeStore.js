import { create } from 'zustand';
import api from '../api/axiosConfig';

const useCollegeStore = create((set, get) => ({
    colleges: [],
    currentCollege: null,
    isLoading: false,
    error: null,

    getAllColleges: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/colleges');
            set({ colleges: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch colleges' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getCollegeById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/colleges/${id}`);
            set({ currentCollege: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch college' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createCollege: async (collegeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/colleges', collegeData);
            set((state) => ({ colleges: [...state.colleges, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create college' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateCollege: async (id, collegeData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/colleges/${id}`, collegeData);
            set((state) => ({
                colleges: state.colleges.map(c => c._id === id ? response.data.data : c),
                currentCollege: state.currentCollege?._id === id ? response.data.data : state.currentCollege
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update college' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteCollege: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/colleges/${id}`);
            set((state) => ({
                colleges: state.colleges.filter(c => c._id !== id),
                currentCollege: state.currentCollege?._id === id ? null : state.currentCollege
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete college' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useCollegeStore;

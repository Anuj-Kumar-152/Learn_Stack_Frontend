import { create } from 'zustand';
import api from '../api/axiosConfig';

const useSubjectStore = create((set, get) => ({
    subjects: [],
    currentSubject: null,
    isLoading: false,
    error: null,

    getAllSubjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/subjects');
            set({ subjects: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch subjects' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getSubjectById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/subjects/${id}`);
            set({ currentSubject: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch subject' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createSubject: async (subjectData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/subjects', subjectData);
            set((state) => ({ subjects: [...state.subjects, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create subject' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateSubject: async (id, subjectData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/subjects/${id}`, subjectData);
            set((state) => ({
                subjects: state.subjects.map(s => s._id === id ? response.data.data : s),
                currentSubject: state.currentSubject?._id === id ? response.data.data : state.currentSubject
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update subject' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSubject: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/subjects/${id}`);
            set((state) => ({
                subjects: state.subjects.filter(s => s._id !== id),
                currentSubject: state.currentSubject?._id === id ? null : state.currentSubject
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete subject' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useSubjectStore;

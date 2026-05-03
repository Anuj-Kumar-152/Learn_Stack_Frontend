import { create } from 'zustand';
import api from '../api/axiosConfig';

const useSubmissionStore = create((set, get) => ({
    submissions: [],
    mySubmissions: [],
    currentSubmission: null,
    isLoading: false,
    error: null,

    getAllSubmissions: async () => {
        set({ isLoading: true, error: null });
        try {
            // Usually Admin/Employee route
            const response = await api.get('/submissions');
            set({ submissions: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch global submissions' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getMySubmissions: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/submissions/me');
            set({ mySubmissions: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch your submissions' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getUserSubmissions: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/submissions/user/${userId}`);
            set({ submissions: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch user submissions' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createSubmission: async (submissionData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/submissions', submissionData);
            set((state) => ({ mySubmissions: [...state.mySubmissions, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to submit code' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateSubmission: async (id, submissionData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/submissions/${id}`, submissionData);
            set((state) => ({
                mySubmissions: state.mySubmissions.map(s => s._id === id ? response.data.data : s),
                submissions: state.submissions.map(s => s._id === id ? response.data.data : s)
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update submission' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSubmission: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/submissions/${id}`);
            set((state) => ({
                mySubmissions: state.mySubmissions.filter(s => s._id !== id),
                submissions: state.submissions.filter(s => s._id !== id)
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete submission' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useSubmissionStore;

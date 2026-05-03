import { create } from 'zustand';
import api from '../api/axiosConfig';

const useProblemStore = create((set, get) => ({
    problems: [],
    currentProblem: null,
    isLoading: false,
    error: null,

    getAllProblems: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/problems');
            set({ problems: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch problems' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getProblemById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/problems/${id}`);
            set({ currentProblem: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch problem' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createProblem: async (problemData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/problems', problemData);
            set((state) => ({ problems: [...state.problems, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create problem' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProblem: async (id, problemData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/problems/${id}`, problemData);
            set((state) => ({
                problems: state.problems.map(p => p._id === id ? response.data.data : p),
                currentProblem: state.currentProblem?._id === id ? response.data.data : state.currentProblem
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update problem' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProblem: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/problems/${id}`);
            set((state) => ({
                problems: state.problems.filter(p => p._id !== id),
                currentProblem: state.currentProblem?._id === id ? null : state.currentProblem
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete problem' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useProblemStore;

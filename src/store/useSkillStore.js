import { create } from 'zustand';
import api from '../api/axiosConfig';

const useSkillStore = create((set, get) => ({
    skills: [],
    mySkills: [],
    isLoading: false,
    error: null,

    getMySkills: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/skills/me');
            set({ mySkills: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch your skills' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getUserSkills: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/skills/user/${userId}`);
            set({ skills: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch user skills' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createSkill: async (skillData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/skills', skillData);
            set((state) => ({ mySkills: [...state.mySkills, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to add skill' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateSkill: async (id, skillData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/skills/${id}`, skillData);
            set((state) => ({
                mySkills: state.mySkills.map(s => s._id === id ? response.data.data : s),
                skills: state.skills.map(s => s._id === id ? response.data.data : s)
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update skill' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSkill: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/skills/${id}`);
            set((state) => ({
                mySkills: state.mySkills.filter(s => s._id !== id),
                skills: state.skills.filter(s => s._id !== id)
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete skill' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useSkillStore;

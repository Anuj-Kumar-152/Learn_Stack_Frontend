import { create } from 'zustand';
import api from '../api/axiosConfig';

const useContentStore = create((set, get) => ({
    contents: [],
    contentsByTopic: [],
    currentContent: null,
    isLoading: false,
    error: null,

    getAllContents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/contents');
            set({ contents: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch contents' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getContentsByTopic: async (topicId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/contents/topic/${topicId}`);
            set({ contentsByTopic: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch contents for topic' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getContentById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/contents/${id}`);
            set({ currentContent: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch content' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createContent: async (contentData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/contents', contentData);
            set((state) => ({
                contents: [...state.contents, response.data.data],
                contentsByTopic: [...state.contentsByTopic, response.data.data]
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create content' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateContent: async (id, contentData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/contents/${id}`, contentData);
            set((state) => ({
                contents: state.contents.map(c => c._id === id ? response.data.data : c),
                contentsByTopic: state.contentsByTopic.map(c => c._id === id ? response.data.data : c),
                currentContent: state.currentContent?._id === id ? response.data.data : state.currentContent
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update content' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteContent: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/contents/${id}`);
            set((state) => ({
                contents: state.contents.filter(c => c._id !== id),
                contentsByTopic: state.contentsByTopic.filter(c => c._id !== id),
                currentContent: state.currentContent?._id === id ? null : state.currentContent
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete content' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useContentStore;

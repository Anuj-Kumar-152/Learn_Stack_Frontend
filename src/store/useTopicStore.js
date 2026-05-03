import { create } from 'zustand';
import api from '../api/axiosConfig';

const getDocId = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || value.id || '';
};

const useTopicStore = create((set, get) => ({
    topics: [],
    topicsBySubject: [],
    currentTopic: null,
    isLoading: false,
    error: null,

    getAllTopics: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/topics');
            set({ topics: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch topics' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getTopicsBySubject: async (subjectId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/topics/subject/${subjectId}`);
            set({ topicsBySubject: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch topics for subject' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getTopicById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/topics/${id}`);
            set({ currentTopic: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch topic' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createTopic: async (topicData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/topics', topicData);
            set((state) => ({
                topics: [...state.topics, response.data.data],
                topicsBySubject: getDocId(response.data.data.subjectId) === topicData.subjectId
                    ? [...state.topicsBySubject, response.data.data]
                    : state.topicsBySubject
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create topic' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateTopic: async (id, topicData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/topics/${id}`, topicData);
            set((state) => ({
                topics: state.topics.map(t => t._id === id ? response.data.data : t),
                topicsBySubject: state.topicsBySubject.map(t => t._id === id ? response.data.data : t),
                currentTopic: state.currentTopic?._id === id ? response.data.data : state.currentTopic
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update topic' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTopic: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/topics/${id}`);
            set((state) => ({
                topics: state.topics.filter(t => t._id !== id),
                topicsBySubject: state.topicsBySubject.filter(t => t._id !== id),
                currentTopic: state.currentTopic?._id === id ? null : state.currentTopic
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete topic' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useTopicStore;

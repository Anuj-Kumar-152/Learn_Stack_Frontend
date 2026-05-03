import { create } from 'zustand';
import api from '../api/axiosConfig';

const useCourseVideoStore = create((set, get) => ({
    videos: [],
    currentVideo: null,
    isLoading: false,
    error: null,

    getAllCourseVideos: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/course-videos');
            set({ videos: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch videos' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getCourseVideoById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/course-videos/${id}`);
            set({ currentVideo: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch video' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createCourseVideo: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            // Note: formData should be an instance of FormData to handle the video file upload
            const response = await api.post('/course-videos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set((state) => ({ videos: [...state.videos, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to upload video' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateCourseVideo: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/course-videos/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set((state) => ({
                videos: state.videos.map(v => v._id === id ? response.data.data : v),
                currentVideo: state.currentVideo?._id === id ? response.data.data : state.currentVideo
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update video' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteCourseVideo: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/course-videos/${id}`);
            set((state) => ({
                videos: state.videos.filter(v => v._id !== id),
                currentVideo: state.currentVideo?._id === id ? null : state.currentVideo
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete video' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useCourseVideoStore;

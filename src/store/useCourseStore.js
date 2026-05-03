import { create } from 'zustand';
import api from '../api/axiosConfig';

const useCourseStore = create((set, get) => ({
    courses: [],
    currentCourse: null,
    isLoading: false,
    error: null,

    getAllCourses: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/courses');
            set({ courses: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch courses' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getCourseById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/courses/${id}`);
            set({ currentCourse: response.data.data });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch course' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createCourse: async (courseData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/courses', courseData);
            set((state) => ({ courses: [...state.courses, response.data.data] }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create course' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateCourse: async (id, courseData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/courses/${id}`, courseData);
            set((state) => ({
                courses: state.courses.map(c => c._id === id ? response.data.data : c),
                currentCourse: state.currentCourse?._id === id ? response.data.data : state.currentCourse
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update course' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteCourse: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/courses/${id}`);
            set((state) => ({
                courses: state.courses.filter(c => c._id !== id),
                currentCourse: state.currentCourse?._id === id ? null : state.currentCourse
            }));
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to delete course' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useCourseStore;

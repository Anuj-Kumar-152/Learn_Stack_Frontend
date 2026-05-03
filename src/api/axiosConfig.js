import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:9000/api', // Adjust if using environment variables
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Read token from js-cookie
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// To prevent multiple refresh requests if multiple APIs fail at once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Check if it's the refresh token endpoint itself failing
            if (originalRequest.url === '/auth/refresh') {
                Cookies.remove('token');
                Cookies.remove('refreshToken');
                window.dispatchEvent(new Event('auth_unauthorized'));
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If currently refreshing, queue the request
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get('refreshToken');
            if (!refreshToken) {
                isRefreshing = false;
                Cookies.remove('token');
                window.dispatchEvent(new Event('auth_unauthorized'));
                return Promise.reject(error);
            }

            try {
                // Manually call axios to avoid interceptor loops
                const res = await axios.post('http://localhost:9000/api/auth/refresh', {
                    refreshToken
                });

                if (res.data.success) {
                    const newAccessToken = res.data.token;
                    const newRefreshToken = res.data.refreshToken;
                    
                    const isSecure = window.location.protocol === 'https:';
                    Cookies.set('token', newAccessToken, { expires: 30, secure: isSecure, sameSite: 'strict' });
                    Cookies.set('refreshToken', newRefreshToken, { expires: 30, secure: isSecure, sameSite: 'strict' });

                    processQueue(null, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    return api(originalRequest);
                }
            } catch (err) {
                processQueue(err, null);
                Cookies.remove('token');
                Cookies.remove('refreshToken');
                window.dispatchEvent(new Event('auth_unauthorized'));
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import Home from './pages/Home';
import Notes from './pages/Notes';
import NotesRedirect from './pages/NotesRedirect';
import Subjects from './pages/Subjects';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import ProblemSolve from './pages/ProblemSolve';
import Colleges from './pages/Colleges';
import PublicLayout from './components/PublicLayout';
// Admin Layout & Views
import AdminLayout from './pages/admin/AdminLayout';
import Overview from './pages/admin/views/Overview';
import ManageUsers from './pages/admin/views/ManageUsers';
import ManageCourses from './pages/admin/views/ManageCourses';
import ManageProblems from './pages/admin/views/ManageProblems';
import ManageContent from './pages/admin/views/ManageContent';
import ManageColleges from './pages/admin/views/ManageColleges';
import UserDashboard from './pages/dashboard/UserDashboard';
import Settings from './pages/dashboard/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        style: { borderRadius: '12px', padding: '16px' }
      }} />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:subjectSlug" element={<Notes />} />
          <Route path="/subjects/:subjectSlug/:topicSlug" element={<Notes />} />
          <Route path="/notes" element={<NotesRedirect />} />
          <Route path="/notes/:subjectSlug" element={<NotesRedirect />} />
          <Route path="/notes/:subjectSlug/:topicSlug" element={<NotesRedirect />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:problemId" element={<ProblemDetail />} />
          <Route path="/colleges" element={<Colleges />} />
        </Route>

        {/* Standard User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'EMPLOYEE']} />}>
          <Route element={<PublicLayout />}>
            <Route path="/problems/:problemId/solve" element={<ProblemSolve />} />
          </Route>
        </Route>

        {/* Admin & Employee Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="problems" element={<ManageProblems />} />
            <Route path="content" element={<ManageContent />} />
            <Route path="colleges" element={<ManageColleges />} />
            
            {/* STRICTLY ADMIN ONLY ROUTE */}
            <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route index element={<ManageUsers />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

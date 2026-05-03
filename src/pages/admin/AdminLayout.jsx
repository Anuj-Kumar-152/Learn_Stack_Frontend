import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    FileCode, 
    Library,
    GraduationCap,
    LogOut 
} from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'EMPLOYEE'] },
        { path: '/admin/users', label: 'Manage Users', icon: Users, roles: ['ADMIN'] }, // ONLY ADMIN
        { path: '/admin/courses', label: 'Courses & Videos', icon: BookOpen, roles: ['ADMIN', 'EMPLOYEE'] },
        { path: '/admin/problems', label: 'Coding Problems', icon: FileCode, roles: ['ADMIN', 'EMPLOYEE'] },
        { path: '/admin/content', label: 'Subjects & Content', icon: Library, roles: ['ADMIN', 'EMPLOYEE'] },
        { path: '/admin/colleges', label: 'Colleges', icon: GraduationCap, roles: ['ADMIN', 'EMPLOYEE'] },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg z-20">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 tracking-tight">
                        StaffPanel
                    </h2>
                    <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{user?.role}</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        // Role Check: If user role is not in allowed roles for this item, don't render it!
                        if (!item.roles.includes(user?.role)) return null;

                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    isActive 
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="p-8">
                    {/* Render the matched child route here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

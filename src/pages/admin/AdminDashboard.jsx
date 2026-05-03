import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Users, BookOpen, FileCode, LayoutDashboard, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 tracking-tight">
                        AdminPanel
                    </h2>
                    <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">LearnStack</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all">
                        <Users className="w-5 h-5" />
                        Manage Users
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all">
                        <BookOpen className="w-5 h-5" />
                        Manage Courses
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all">
                        <FileCode className="w-5 h-5" />
                        Manage Problems
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor system metrics and manage content.</p>
                    </div>
                    <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-500 transition-colors">
                        <Settings className="w-6 h-6" />
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Users', value: '2,845', trend: '+12%', color: 'indigo' },
                        { label: 'Active Courses', value: '45', trend: '+3', color: 'emerald' },
                        { label: 'Problems', value: '312', trend: '+24', color: 'orange' },
                        { label: 'Submissions', value: '14.2k', trend: '+1.2k', color: 'pink' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                            <div className="flex items-end gap-3 mt-2">
                                <h3 className="text-4xl font-black">{stat.value}</h3>
                                <span className={`text-sm font-bold text-${stat.color}-500 mb-1`}>{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Table Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold">Recent System Activity</h3>
                        <button className="text-sm font-semibold text-indigo-500 hover:underline">View All</button>
                    </div>
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p>Detailed data tables for managing entities will render here.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

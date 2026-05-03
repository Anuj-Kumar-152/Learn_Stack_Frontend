import React, { useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useProfileStore from '../../store/useProfileStore';
import useSubmissionStore from '../../store/useSubmissionStore';
import { BookOpen, Code2, Trophy, Clock, CheckCircle } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuthStore();
    const { currentProfile, getMyProfile, isLoading: isProfileLoading } = useProfileStore();
    const { mySubmissions, getMySubmissions, isLoading: isSubLoading } = useSubmissionStore();

    useEffect(() => {
        getMyProfile();
        getMySubmissions();
    }, []);

    const passedSubmissions = mySubmissions.filter(sub => sub.passed === sub.total).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {currentProfile?.avatar ? (
                                <img src={currentProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                                    {user?.name?.charAt(0)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-gray-500 mt-1">{currentProfile?.summary || 'Ready to learn something new today?'}</p>
                    </div>
                </div>

                {/* Settings Button */}
                <a href="/dashboard/settings" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                        <h3 className="text-2xl font-bold">2 Active</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Problems Solved</p>
                        <h3 className="text-2xl font-bold">{passedSubmissions}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Global Rank</p>
                        <h3 className="text-2xl font-bold">#4,291</h3>
                    </div>
                </div>
            </div>

            {/* Submissions Activity */}
            <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" /> Recent Submissions
                </h3>
                {isSubLoading ? (
                    <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                ) : mySubmissions.length > 0 ? (
                    <div className="space-y-4">
                        {mySubmissions.slice(0, 5).map((sub) => (
                            <div key={sub._id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{sub.problemId?.title || 'Unknown Problem'}</h4>
                                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-mono">{sub.language}</span>
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    {sub.status === 'Accepted' || sub.passed === sub.total ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-bold">
                                            <CheckCircle className="w-4 h-4" /> Passed
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-sm font-bold">
                                            Failed ({sub.passed}/{sub.total})
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500">You haven't submitted any solutions yet.</p>
                        <button className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                            Solve a Problem
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

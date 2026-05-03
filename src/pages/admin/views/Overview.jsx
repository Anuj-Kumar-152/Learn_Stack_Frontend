import React from 'react';

const Overview = () => {
    return (
        <div>
            <header className="mb-10">
                <h1 className="text-3xl font-bold">System Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">High level metrics and recent platform activity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Active Courses', value: '12', trend: '+2', color: 'indigo' },
                    { label: 'Total Problems', value: '156', trend: '+14', color: 'emerald' },
                    { label: 'Submissions', value: '3.2k', trend: '+400', color: 'orange' },
                    { label: 'System Health', value: '99%', trend: 'Stable', color: 'pink' }
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

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <p className="text-gray-500 mb-6">Use the sidebar to navigate to specific management areas. As staff, any modifications made to courses or problems are instantly live.</p>
                
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-lg shadow-indigo-500/30">
                        Create New Course
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-bold">
                        Add Problem
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;

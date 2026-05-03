import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { Shield, ShieldAlert, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const { user, toggleMFA } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggle = async () => {
        setIsSubmitting(true);
        try {
            // Toggle the inverse of current state
            const newMfaState = !user?.isMFA;
            await toggleMFA(newMfaState);
            toast.success(`Two-Factor Authentication is now ${newMfaState ? 'Enabled' : 'Disabled'}`);
        } catch (error) {
            toast.error('Failed to update MFA settings.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight">Security Settings</h1>
                <p className="text-gray-500 mt-2">Manage your account security and two-factor authentication.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className={`mt-1 p-3 rounded-2xl ${user?.isMFA ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700'}`}>
                                {user?.isMFA ? <Shield className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Two-Factor Authentication (MFA)</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mb-4">
                                    When enabled, you will be required to enter a 6-digit one-time password sent to your email (<span className="font-semibold text-gray-700 dark:text-gray-300">{user?.email}</span>) every time you sign in. This significantly increases your account security.
                                </p>
                                
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                    Status: 
                                    <span className={user?.isMFA ? 'text-emerald-500' : 'text-red-500'}>
                                        {user?.isMFA ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex flex-col items-end gap-3">
                            <button
                                onClick={handleToggle}
                                disabled={isSubmitting}
                                className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${user?.isMFA ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                role="switch"
                                aria-checked={user?.isMFA}
                            >
                                <span className="sr-only">Toggle MFA</span>
                                <span
                                    className={`pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user?.isMFA ? 'translate-x-6' : 'translate-x-0'}`}
                                >
                                    <span
                                        className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${user?.isMFA ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'}`}
                                        aria-hidden="true"
                                    >
                                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <span
                                        className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${user?.isMFA ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'}`}
                                        aria-hidden="true"
                                    >
                                        <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-gray-400" />
                        <p className="text-sm text-gray-500">
                            <strong>Note:</strong> Currently, OTPs are delivered exclusively via your registered email address.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

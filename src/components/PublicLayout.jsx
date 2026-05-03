import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, Code2, GraduationCap, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const navItems = [
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/colleges', label: 'Colleges', icon: GraduationCap }
];

const PublicLayout = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const navLinkClass = ({ isActive }) =>
        `group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 ${
            isActive
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
        }`;

    const sidebarLinkClass = ({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition-all duration-200 ${
            isActive
                ? 'bg-gray-950 text-white shadow-md shadow-gray-950/10'
                : 'text-gray-600 hover:translate-x-1 hover:bg-gray-100 hover:text-gray-950'
        }`;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950">
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 shadow-sm transition-transform duration-200 hover:scale-105">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <div className="text-lg font-black tracking-tight">LearnStack</div>
                            <div className="hidden text-xs font-semibold text-gray-500 sm:block">Subjects, practice, progress</div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={user?.role === 'ADMIN' || user?.role === 'EMPLOYEE' ? '/admin' : '/dashboard'}
                                    className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm sm:inline-flex"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <div className="hidden items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 sm:flex">
                                    <User className="h-4 w-4" />
                                    {user?.name || 'Account'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg p-2 text-gray-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 md:hidden">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={navLinkClass}>
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 border-r border-gray-200 bg-white/95 p-4 backdrop-blur md:block">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={sidebarLinkClass}>
                            <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                    <div className="text-sm font-black text-emerald-900">Read freely</div>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                        Subjects and problems are open. Login only when you want to solve.
                    </p>
                </div>
            </aside>

            <div className="transition-all duration-300 md:pl-64">
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;

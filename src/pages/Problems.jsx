import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Search } from 'lucide-react';
import useProblemStore from '../store/useProblemStore';

const levelStyles = {
    EASY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HARD: 'bg-red-50 text-red-700 border-red-200'
};

const Problems = () => {
    const { problems, getAllProblems, isLoading } = useProblemStore();
    const [query, setQuery] = useState('');
    const [level, setLevel] = useState('ALL');

    useEffect(() => {
        getAllProblems();
    }, []);

    const filteredProblems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return problems.filter(problem => {
            const matchesQuery = !normalizedQuery
                || problem.title?.toLowerCase().includes(normalizedQuery)
                || problem.slug?.toLowerCase().includes(normalizedQuery)
                || problem.summary?.toLowerCase().includes(normalizedQuery);
            const matchesLevel = level === 'ALL' || problem.level === level;
            return matchesQuery && matchesLevel;
        });
    }, [problems, query, level]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
                    <Code2 className="h-4 w-4" />
                    Public Problem Set
                </div>
                <h1 className="mt-2 text-3xl font-black">Coding Problems</h1>
                <p className="mt-2 max-w-3xl text-gray-600">
                    Read problem statements without logging in. Sign in when you are ready to solve and run code.
                </p>
            </div>

            <div className="mb-5 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search problems"
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:border-blue-400"
                    />
                </div>
                <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                    {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(item => (
                        <button
                            key={item}
                            onClick={() => setLevel(item)}
                            className={`rounded-md px-3 py-2 text-sm font-bold ${level === item ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="grid grid-cols-[1fr_110px_110px] border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-black uppercase tracking-wider text-gray-500">
                    <span>Problem</span>
                    <span>Level</span>
                    <span className="text-right">Action</span>
                </div>
                {isLoading ? (
                    <div className="p-6 text-gray-500">Loading problems...</div>
                ) : filteredProblems.length > 0 ? (
                    filteredProblems.map(problem => (
                        <Link
                            key={problem._id}
                            to={`/problems/${problem.slug || problem._id}`}
                            className="grid grid-cols-[1fr_110px_110px] items-center border-b border-gray-100 px-4 py-4 last:border-b-0 hover:bg-gray-50"
                        >
                            <div className="min-w-0">
                                <div className="truncate font-black text-gray-950">{problem.title}</div>
                                <div className="mt-1 line-clamp-1 text-sm text-gray-500">{problem.summary}</div>
                            </div>
                            <div>
                                <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${levelStyles[problem.level] || 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                                    {problem.level || 'NA'}
                                </span>
                            </div>
                            <div className="text-right text-sm font-bold text-blue-700">Open</div>
                        </Link>
                    ))
                ) : (
                    <div className="p-6 text-gray-500">No problems found.</div>
                )}
            </div>
        </main>
    );
};

export default Problems;

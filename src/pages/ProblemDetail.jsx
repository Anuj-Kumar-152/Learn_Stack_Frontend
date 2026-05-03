import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Code2, ExternalLink, Lock } from 'lucide-react';
import useProblemStore from '../store/useProblemStore';
import useAuthStore from '../store/useAuthStore';

const levelStyles = {
    EASY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HARD: 'bg-red-50 text-red-700 border-red-200'
};

const ProblemDetail = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const { currentProblem, getProblemById, isLoading } = useProblemStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        getProblemById(problemId);
    }, [problemId]);

    const handleSolve = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/problems/${problemId}/solve` } });
            return;
        }
        navigate(`/problems/${problemId}/solve`);
    };

    if (isLoading || !currentProblem) {
        return <main className="mx-auto max-w-5xl px-4 py-10 text-gray-500">Loading problem...</main>;
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between gap-4">
                <Link to="/problems" className="text-sm font-bold text-gray-500 hover:text-gray-900">Back to problems</Link>
                <button
                    onClick={handleSolve}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                    {isAuthenticated ? <Code2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    Solve Problem
                </button>
            </div>

            <article className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${levelStyles[currentProblem.level] || 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                            {currentProblem.level || 'NA'}
                        </span>
                        {currentProblem.timeComplexity && (
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-black text-gray-600">
                                {currentProblem.timeComplexity}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-black">{currentProblem.title}</h1>
                    <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">{currentProblem.summary}</p>
                </div>

                <div className="grid gap-6 p-6">
                    {currentProblem.examples?.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-lg font-black">Examples</h2>
                            <div className="space-y-3">
                                {currentProblem.examples.map((example, index) => (
                                    <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <pre className="overflow-x-auto rounded-md bg-gray-950 p-3 text-sm text-gray-100"><code>{example.input}</code></pre>
                                            <pre className="overflow-x-auto rounded-md bg-gray-950 p-3 text-sm text-gray-100"><code>{example.output}</code></pre>
                                        </div>
                                        {example.summary && <p className="mt-3 text-sm text-gray-600">{example.summary}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {currentProblem.hint && (
                        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h2 className="mb-2 font-black text-amber-900">Hint</h2>
                            <p className="text-sm leading-6 text-amber-900">{currentProblem.hint}</p>
                        </section>
                    )}

                    {currentProblem.referenceUrls?.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-lg font-black">References</h2>
                            <div className="flex flex-wrap gap-2">
                                {currentProblem.referenceUrls.map((reference, index) => (
                                    <a
                                        key={index}
                                        href={reference.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                                    >
                                        {reference.platformName}
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>
        </main>
    );
};

export default ProblemDetail;

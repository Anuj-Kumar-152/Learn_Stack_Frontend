import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import api from '../api/axiosConfig';
import useProblemStore from '../store/useProblemStore';

const defaultCode = `public int solve(int[] nums, int target) {
    // Write your solution here
    return 0;
}`;

const ProblemSolve = () => {
    const { problemId } = useParams();
    const { currentProblem, getProblemById, isLoading } = useProblemStore();
    const [code, setCode] = useState(defaultCode);
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        getProblemById(problemId);
    }, [problemId]);

    const javaSnippet = useMemo(() => {
        return currentProblem?.snippets?.find(snippet => snippet.languageName?.toLowerCase() === 'java')?.snippet;
    }, [currentProblem]);

    useEffect(() => {
        if (javaSnippet) setCode(javaSnippet);
        if (currentProblem?.examples?.[0]?.input) setInput(currentProblem.examples[0].input);
    }, [javaSnippet, currentProblem]);

    const handleRun = async () => {
        setIsRunning(true);
        setResult(null);
        try {
            const response = await api.post('/run-code/run', {
                code,
                input,
                slug: currentProblem.slug
            });
            setResult(response.data);
        } catch (error) {
            setResult({ output: error.response?.data?.message || 'Unable to run code' });
        } finally {
            setIsRunning(false);
        }
    };

    if (isLoading || !currentProblem) {
        return <main className="mx-auto max-w-7xl px-4 py-10 text-gray-500">Loading solve workspace...</main>;
    }

    return (
        <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <section className="rounded-lg border border-gray-200 bg-white p-5">
                <Link to={`/problems/${currentProblem.slug || currentProblem._id}`} className="text-sm font-bold text-gray-500 hover:text-gray-900">Back to statement</Link>
                <h1 className="mt-4 text-2xl font-black">{currentProblem.title}</h1>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">{currentProblem.summary}</p>
                {currentProblem.examples?.length > 0 && (
                    <div className="mt-6">
                        <h2 className="mb-3 font-black">Examples</h2>
                        <div className="space-y-3">
                            {currentProblem.examples.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInput(example.input)}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50"
                                >
                                    <div className="text-xs font-black uppercase text-gray-500">Example {index + 1}</div>
                                    <pre className="mt-2 overflow-x-auto text-sm"><code>{example.input}</code></pre>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <section className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                    <div className="font-black">Java Workspace</div>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        <Play className="h-4 w-4" />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                </div>
                <div className="grid gap-4 p-4">
                    <textarea
                        value={code}
                        onChange={event => setCode(event.target.value)}
                        spellCheck="false"
                        className="min-h-[360px] w-full resize-y rounded-lg border border-gray-200 bg-gray-950 p-4 font-mono text-sm leading-6 text-gray-100 outline-none focus:border-blue-400"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-black text-gray-700">Input</label>
                            <textarea
                                value={input}
                                onChange={event => setInput(event.target.value)}
                                className="h-36 w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-black text-gray-700">Output</label>
                            <pre className="h-36 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                                <code>{result ? `Output:\n${result.output || ''}\n\nExpected:\n${result.expected || 'No matching sample'}` : 'Run code to see output.'}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProblemSolve;

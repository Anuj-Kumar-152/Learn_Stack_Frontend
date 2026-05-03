import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, GraduationCap, Layers, ListChecks } from 'lucide-react';
import useSubjectStore from '../store/useSubjectStore';
import useProblemStore from '../store/useProblemStore';
import useCollegeStore from '../store/useCollegeStore';

const Home = () => {
    const { subjects, getAllSubjects } = useSubjectStore();
    const { problems, getAllProblems } = useProblemStore();
    const { colleges, getAllColleges } = useCollegeStore();

    useEffect(() => {
        getAllSubjects();
        getAllProblems();
        getAllColleges();
    }, []);

    const easyCount = problems.filter(problem => problem.level === 'EASY').length;

    return (
        <main>
            <section className="border-b border-gray-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
                    <div className="flex flex-col justify-center">
                        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                            <ListChecks className="h-4 w-4" />
                            Learn first, practice when ready
                        </div>
                        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                            Read structured notes and practice coding problems in one place.
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                            Browse subjects, topics, notes, and problem statements freely. Sign in only when you want to run or submit a solution.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/subjects" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                                Start Learning <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link to="/problems" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold text-gray-800 hover:bg-gray-50">
                                Browse Problems <Code2 className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid content-start gap-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <BookOpen className="mb-3 h-5 w-5 text-emerald-600" />
                                <div className="text-2xl font-black">{subjects.length}</div>
                                <div className="text-sm font-semibold text-gray-500">Subjects</div>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <Code2 className="mb-3 h-5 w-5 text-blue-600" />
                                <div className="text-2xl font-black">{problems.length}</div>
                                <div className="text-sm font-semibold text-gray-500">Problems</div>
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <GraduationCap className="mb-3 h-5 w-5 text-violet-600" />
                                <div className="text-2xl font-black">{colleges.length}</div>
                                <div className="text-sm font-semibold text-gray-500">Colleges</div>
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-black">Popular Subjects</h2>
                                <Link to="/subjects" className="text-sm font-bold text-emerald-700">View all</Link>
                            </div>
                            <div className="space-y-3">
                                {subjects.slice(0, 4).map(subject => (
                                    <Link key={subject._id} to={`/subjects/${subject.slug || subject._id}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:border-emerald-200 hover:bg-emerald-50">
                                        <div>
                                            <div className="font-bold">{subject.name}</div>
                                            <div className="line-clamp-1 text-sm text-gray-500">{subject.summary || 'Explore topics and notes'}</div>
                                        </div>
                                        <Layers className="h-4 w-4 text-gray-400" />
                                    </Link>
                                ))}
                                {subjects.length === 0 && <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No subjects added yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <BookOpen className="mb-4 h-6 w-6 text-emerald-600" />
                    <h3 className="text-lg font-black">Notes Are Public</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">Subject, topic, and content reads stay open for all visitors.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <Code2 className="mb-4 h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-black">Practice Is Gated</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">Problem statements are public, but running code requires authentication.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <ListChecks className="mb-4 h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-black">{easyCount} Easy Problems</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">Start with approachable problems and move up by difficulty.</p>
                </div>
            </section>
        </main>
    );
};

export default Home;

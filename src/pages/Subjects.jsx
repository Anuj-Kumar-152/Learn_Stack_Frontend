import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import useSubjectStore from '../store/useSubjectStore';

const Subjects = () => {
    const { subjects, getAllSubjects, isLoading } = useSubjectStore();

    useEffect(() => {
        getAllSubjects();
    }, []);

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <BookOpen className="h-4 w-4" />
                    Subjects
                </div>
                <h1 className="text-3xl font-black text-gray-950">Choose a subject</h1>
                <p className="mt-2 max-w-2xl text-gray-600">
                    Start by selecting one subject. The next page will show its topics and notes.
                </p>
            </section>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map(item => (
                        <div key={item} className="h-36 animate-pulse rounded-lg border border-gray-200 bg-white" />
                    ))}
                </div>
            ) : subjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {subjects.map(subject => (
                        <Link
                            key={subject._id}
                            to={`/subjects/${subject.slug || subject._id}`}
                            className="group rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                        >
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black capitalize text-gray-950">{subject.name}</h2>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                                {subject.summary || 'Open this subject to see all related topics.'}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                                View topics
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                    No subjects available yet.
                </div>
            )}
        </main>
    );
};

export default Subjects;

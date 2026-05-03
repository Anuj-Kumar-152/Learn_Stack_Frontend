import React, { useEffect } from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import useCollegeStore from '../store/useCollegeStore';

const Colleges = () => {
    const { colleges, getAllColleges, isLoading } = useCollegeStore();

    useEffect(() => {
        getAllColleges();
    }, []);

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-violet-700">
                    <GraduationCap className="h-4 w-4" />
                    College Directory
                </div>
                <h1 className="mt-2 text-3xl font-black">Colleges</h1>
                <p className="mt-2 text-gray-600">Browse colleges managed by the admin team.</p>
            </div>

            {isLoading ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">Loading colleges...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {colleges.map(college => (
                        <article key={college._id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                            {college.collegeCoverImage && <img src={college.collegeCoverImage} alt="" className="h-32 w-full object-cover" />}
                            <div className="p-5">
                                <div className="flex items-start gap-3">
                                    {college.collegeIcon ? (
                                        <img src={college.collegeIcon} alt="" className="h-11 w-11 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                                            <GraduationCap className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-black capitalize">{college.name}</h2>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            {[college.location, college.state, college.country].filter(Boolean).join(', ') || 'Location unavailable'}
                                        </div>
                                    </div>
                                </div>
                                {college.summary && <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{college.summary}</p>}
                            </div>
                        </article>
                    ))}
                    {colleges.length === 0 && <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-500">No colleges added yet.</div>}
                </div>
            )}
        </main>
    );
};

export default Colleges;

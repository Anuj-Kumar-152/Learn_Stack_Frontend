import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronDown, FileText, Hash, Search } from 'lucide-react';
import useSubjectStore from '../store/useSubjectStore';
import useTopicStore from '../store/useTopicStore';
import useContentStore from '../store/useContentStore';
import MarkdownRenderer from '../components/MarkdownRenderer';

const getDocId = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || value.id || '';
};

const Notes = () => {
    const { subjectSlug, topicSlug } = useParams();
    const { subjects, getAllSubjects, isLoading: subjectsLoading } = useSubjectStore();
    const { topics, getAllTopics, isLoading: topicsLoading } = useTopicStore();
    const { contents, getAllContents, isLoading: contentsLoading } = useContentStore();
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        getAllSubjects();
        getAllTopics();
        getAllContents();
    }, []);

    const activeSubject = useMemo(() => {
        if (subjectSlug) {
            return subjects.find(subject => subject.slug === subjectSlug || subject._id === subjectSlug);
        }
        return subjects.find(subject => subject._id === selectedSubjectId);
    }, [subjects, selectedSubjectId, subjectSlug]);

    const subjectTopics = useMemo(
        () => topics.filter(topic => {
            const belongsToSubject = getDocId(topic.subjectId) === activeSubject?._id;
            const matchesSearch = !search.trim()
                || topic.name?.toLowerCase().includes(search.trim().toLowerCase())
                || topic.summary?.toLowerCase().includes(search.trim().toLowerCase());
            return belongsToSubject && matchesSearch;
        }),
        [topics, activeSubject, search]
    );

    const activeTopic = useMemo(() => {
        if (topicSlug) {
            return subjectTopics.find(topic => topic.slug === topicSlug || topic._id === topicSlug);
        }
        return subjectTopics[0];
    }, [subjectTopics, topicSlug]);

    const topicContents = useMemo(
        () => contents.filter(content => getDocId(content.topicId) === activeTopic?._id),
        [contents, activeTopic]
    );

    const isLoading = subjectsLoading || topicsLoading || contentsLoading;

    return (
        <main className="grid min-h-[calc(100vh-65px)] bg-white lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-gray-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-65px)] lg:border-b-0 lg:border-r">
                <div className="border-b border-gray-200 p-4">
                    <Link to="/subjects" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-950">
                        <ArrowLeft className="h-4 w-4" />
                        All subjects
                    </Link>

                    <div className="flex items-start gap-3 rounded-lg bg-gray-950 p-3 text-white">
                        <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                        <div className="min-w-0">
                            <div className="line-clamp-1 text-base font-black capitalize">{activeSubject?.name || 'Subject'}</div>
                            <div className="mt-1 text-xs font-semibold text-gray-300">
                                {subjectTopics.length} topic{subjectTopics.length === 1 ? '' : 's'}
                            </div>
                        </div>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
                    </div>

                    <div className="relative mt-3">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Search topics"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm font-medium outline-none transition-colors focus:border-emerald-400 focus:bg-white"
                        />
                    </div>
                </div>

                <nav className="max-h-[calc(100vh-230px)] overflow-y-auto p-2">
                    {subjectTopics.map((topic, index) => {
                        const isActive = activeTopic?._id === topic._id;
                        const topicContentCount = contents.filter(content => getDocId(content.topicId) === topic._id).length;

                        return (
                            <div key={topic._id} className="mb-1">
                                <Link
                                    to={`/subjects/${activeSubject?.slug || activeSubject?._id}/${topic.slug || topic._id}`}
                                    className={`group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-900'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-950'
                                    }`}
                                >
                                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-black ${
                                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate font-bold">{topic.name}</span>
                                        <span className={`mt-0.5 block text-xs ${isActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                                            {topicContentCount || 0} content module{topicContentCount === 1 ? '' : 's'}
                                        </span>
                                    </span>
                                </Link>

                                {isActive && topicContents.length > 0 && (
                                    <div className="ml-8 mt-1 border-l border-emerald-100 pl-3">
                                        {topicContents.map((content, contentIndex) => (
                                            <a
                                                key={content._id}
                                                href={`#content-${content._id}`}
                                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            >
                                                <Hash className="h-3.5 w-3.5" />
                                                Content {contentIndex + 1}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {!isLoading && activeSubject && subjectTopics.length === 0 && (
                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                            No topics found for this subject.
                        </div>
                    )}
                </nav>
            </aside>

            <section className="min-w-0 bg-gray-50">
                <article className="mx-auto min-h-full max-w-5xl bg-white px-5 py-6 sm:px-8 lg:px-10">
                    {isLoading ? (
                        <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
                    ) : activeTopic ? (
                        <>
                            <div className="sticky top-16 z-20 -mx-5 mb-6 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
                                <div className="mb-1 flex items-center gap-2 text-sm font-bold text-emerald-700 capitalize">
                                    <FileText className="h-4 w-4" />
                                    {activeSubject?.name}
                                </div>
                                <h1 className="text-3xl font-black text-gray-950">{activeTopic.name}</h1>
                                {activeTopic.summary && <p className="mt-2 max-w-3xl text-gray-600">{activeTopic.summary}</p>}
                            </div>
                            <div className="space-y-8">
                                {topicContents.map(content => (
                                    <section id={`content-${content._id}`} key={content._id} className="scroll-mt-36 border-b border-gray-100 pb-8 last:border-b-0 prose max-w-none prose-headings:font-black prose-p:leading-7">
                                        <MarkdownRenderer content={content.summary} />
                                        {content.images?.length > 0 && (
                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                {content.images.map((image, index) => (
                                                    <img key={index} src={image} alt="" className="rounded-lg border border-gray-200 object-cover" />
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                ))}
                                {topicContents.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                                        No content added for this topic yet.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">Choose a topic to start reading.</div>
                    )}
                </article>
            </section>
        </main>
    );
};

export default Notes;

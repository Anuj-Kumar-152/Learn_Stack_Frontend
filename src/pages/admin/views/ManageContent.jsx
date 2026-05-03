import React, { useEffect, useState } from 'react';
import useSubjectStore from '../../../store/useSubjectStore';
import useTopicStore from '../../../store/useTopicStore';
import useContentStore from '../../../store/useContentStore';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { toast } from 'react-hot-toast';
import { BookOpen, Layers, FileText, Plus, Trash2, ArrowLeft, Image as ImageIcon, Save, X } from 'lucide-react';

const getDocId = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || value.id || '';
};

const ManageContent = () => {
    // --- STORES ---
    const { subjects, isLoading: isSubLoading, getAllSubjects, createSubject, updateSubject, deleteSubject } = useSubjectStore();
    const { topics, isLoading: isTopLoading, getAllTopics, createTopic, updateTopic, deleteTopic } = useTopicStore();
    const { contents, isLoading: isConLoading, getAllContents, createContent, updateContent, deleteContent } = useContentStore();

    // --- VIEW STATE ---
    const [viewLevel, setViewLevel] = useState('SUBJECTS'); // 'SUBJECTS', 'TOPICS', 'CONTENT'
    const [activeSubject, setActiveSubject] = useState(null);
    const [activeTopic, setActiveTopic] = useState(null);

    // --- MODAL STATES ---
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);

    // --- FORM STATES ---
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [subjectFormData, setSubjectFormData] = useState({ name: '', slug: '', summary: '', icon: '', coverImage: '' });

    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [topicFormData, setTopicFormData] = useState({ name: '', slug: '', summary: '' });

    const [selectedContentId, setSelectedContentId] = useState(null);
    const [contentFormData, setContentFormData] = useState({ summary: '', images: [] });

    useEffect(() => {
        getAllSubjects();
        getAllTopics();
        getAllContents();
    }, []);

    // ================== SUBJECT HANDLERS ==================
    const handleSubjectSave = async (e) => {
        e.preventDefault();
        try {
            if (selectedSubjectId) await updateSubject(selectedSubjectId, subjectFormData);
            else await createSubject(subjectFormData);
            toast.success(selectedSubjectId ? 'Subject updated' : 'Subject created');
            setIsSubjectModalOpen(false);
        } catch (error) {
            toast.error('Failed to save subject');
        }
    };

    const handleSubjectDelete = async (subject) => {
        if (window.confirm(`Delete subject "${subject.name}"?`)) {
            try { await deleteSubject(subject._id); toast.success('Deleted'); } 
            catch (e) { toast.error('Failed to delete'); }
        }
    };

    // ================== TOPIC HANDLERS ==================
    const handleTopicSave = async (e) => {
        e.preventDefault();
        try {
            if (!activeSubject?._id) {
                toast.error('Please select a subject first');
                return;
            }

            const data = { ...topicFormData, subjectId: activeSubject._id };
            if (selectedTopicId) await updateTopic(selectedTopicId, data);
            else await createTopic(data);
            toast.success(selectedTopicId ? 'Topic updated' : 'Topic created');
            setIsTopicModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save topic');
        }
    };

    const handleTopicDelete = async (topic) => {
        if (window.confirm(`Delete topic "${topic.name}"?`)) {
            try { await deleteTopic(topic._id); toast.success('Deleted'); } 
            catch (e) { toast.error('Failed to delete'); }
        }
    };

    // ================== CONTENT HANDLERS ==================
    const handleContentSave = async (e) => {
        e.preventDefault();
        try {
            if (!activeTopic?._id) {
                toast.error('Please select a topic first');
                return;
            }

            const data = { ...contentFormData, topicId: activeTopic._id };
            if (selectedContentId) await updateContent(selectedContentId, data);
            else await createContent(data);
            toast.success(selectedContentId ? 'Content updated' : 'Content created');
            setIsContentModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save content');
        }
    };

    const handleContentDelete = async (content) => {
        if (window.confirm(`Delete this content module?`)) {
            try { await deleteContent(content._id); toast.success('Deleted'); } 
            catch (e) { toast.error('Failed to delete'); }
        }
    };

    // --- Dynamic Content Images ---
    const handleAddImage = () => setContentFormData({ ...contentFormData, images: [...contentFormData.images, ''] });
    const handleUpdateImage = (index, value) => {
        const newImages = [...contentFormData.images];
        newImages[index] = value;
        setContentFormData({ ...contentFormData, images: newImages });
    };
    const handleRemoveImage = (index) => {
        setContentFormData({ ...contentFormData, images: contentFormData.images.filter((_, i) => i !== index) });
    };

    // ================== COLUMNS ==================
    const subjectCols = [
        { header: 'Subject', accessor: (row) => <div className="font-bold text-gray-200">{row.name}</div> },
        { header: 'Slug', accessor: (row) => <span className="text-gray-400 font-mono text-sm">{row.slug}</span> },
        { header: 'Topics', accessor: (row) => (
            <button onClick={() => { setActiveSubject(row); setViewLevel('TOPICS'); }} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-sm font-semibold transition-colors">
                <Layers className="w-4 h-4" /> Manage Topics
            </button>
        )}
    ];

    const topicCols = [
        { header: 'Topic', accessor: (row) => <div className="font-bold text-gray-200">{row.name}</div> },
        { header: 'Slug', accessor: (row) => <span className="text-gray-400 font-mono text-sm">{row.slug}</span> },
        { header: 'Content Modules', accessor: (row) => (
            <button onClick={() => { setActiveTopic(row); setViewLevel('CONTENT'); }} className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg text-sm font-semibold transition-colors">
                <FileText className="w-4 h-4" /> Manage Content
            </button>
        )}
    ];

    const contentCols = [
        { header: 'Summary Preview', accessor: (row) => <div className="text-gray-300 truncate max-w-md">{row.summary}</div> },
        { header: 'Images', accessor: (row) => <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md text-xs">{row.images?.length || 0} attached</span> }
    ];

    // ================== VIEWS ==================
    return (
        <div className="relative min-h-screen pb-10">
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10">
                {/* === LEVEL 1: SUBJECTS === */}
                {viewLevel === 'SUBJECTS' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                                        <BookOpen className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h1 className="text-4xl font-extrabold text-white">Manage Subjects</h1>
                                </div>
                                <p className="text-gray-400 text-sm ml-1">Top-level curriculum categories.</p>
                            </div>
                            <button onClick={() => { setSubjectFormData({name:'',slug:'',summary:'',icon:'',coverImage:''}); setSelectedSubjectId(null); setIsSubjectModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-all">
                                <Plus className="w-4 h-4" /> Add Subject
                            </button>
                        </div>
                        <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
                            <DataTable columns={subjectCols} data={subjects} isLoading={isSubLoading} onDelete={handleSubjectDelete} onEdit={(row) => {
                                setSubjectFormData({name: row.name, slug: row.slug, summary: row.summary, icon: row.icon||'', coverImage: row.coverImage||''});
                                setSelectedSubjectId(row._id); setIsSubjectModalOpen(true);
                            }} />
                        </div>
                    </div>
                )}

                {/* === LEVEL 2: TOPICS === */}
                {viewLevel === 'TOPICS' && (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <button onClick={() => setViewLevel('SUBJECTS')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Subjects
                        </button>
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
                                        <Layers className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h1 className="text-4xl font-extrabold text-white">{activeSubject?.name}</h1>
                                </div>
                                <p className="text-gray-400 text-sm ml-1">Manage topics under this subject.</p>
                            </div>
                            <button onClick={() => { setTopicFormData({name:'',slug:'',summary:''}); setSelectedTopicId(null); setIsTopicModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-all">
                                <Plus className="w-4 h-4" /> Add Topic
                            </button>
                        </div>
                        <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
                            <DataTable columns={topicCols} data={topics.filter(t => getDocId(t.subjectId) === activeSubject?._id)} isLoading={isTopLoading} onDelete={handleTopicDelete} onEdit={(row) => {
                                setTopicFormData({name: row.name, slug: row.slug, summary: row.summary});
                                setSelectedTopicId(row._id); setIsTopicModalOpen(true);
                            }} />
                        </div>
                    </div>
                )}

                {/* === LEVEL 3: CONTENT === */}
                {viewLevel === 'CONTENT' && (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <button onClick={() => setViewLevel('TOPICS')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Topics
                        </button>
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl border border-pink-500/30">
                                        <FileText className="w-6 h-6 text-pink-400" />
                                    </div>
                                    <h1 className="text-4xl font-extrabold text-white">{activeTopic?.name}</h1>
                                </div>
                                <p className="text-gray-400 text-sm ml-1">Manage detailed content modules for this topic.</p>
                            </div>
                            <button onClick={() => { setContentFormData({summary:'',images:[]}); setSelectedContentId(null); setIsContentModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-all">
                                <Plus className="w-4 h-4" /> Add Content
                            </button>
                        </div>
                        <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
                            <DataTable columns={contentCols} data={contents.filter(c => getDocId(c.topicId) === activeTopic?._id)} isLoading={isConLoading} onDelete={handleContentDelete} onEdit={(row) => {
                                setContentFormData({summary: row.summary, images: row.images || []});
                                setSelectedContentId(row._id); setIsContentModalOpen(true);
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ================== MODALS ================== */}
            
            {/* SUBJECT MODAL */}
            <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title={selectedSubjectId ? "Update Subject" : "Create Subject"}>
                <form onSubmit={handleSubjectSave} className="space-y-4">
                    <input type="text" required placeholder="Subject Name" value={subjectFormData.name} onChange={e => setSubjectFormData({...subjectFormData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-blue-500" />
                    <input type="text" required placeholder="Slug (e.g. data-structures)" value={subjectFormData.slug} onChange={e => setSubjectFormData({...subjectFormData, slug: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-mono focus:border-blue-500" />
                    <textarea required placeholder="Summary" rows="3" value={subjectFormData.summary} onChange={e => setSubjectFormData({...subjectFormData, summary: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white resize-none focus:border-blue-500"></textarea>
                    <input type="text" placeholder="Icon URL (Optional)" value={subjectFormData.icon} onChange={e => setSubjectFormData({...subjectFormData, icon: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-blue-500" />
                    <input type="text" placeholder="Cover Image URL (Optional)" value={subjectFormData.coverImage} onChange={e => setSubjectFormData({...subjectFormData, coverImage: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-blue-500" />
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold">Save Subject</button>
                </form>
            </Modal>

            {/* TOPIC MODAL */}
            <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title={selectedTopicId ? "Update Topic" : "Create Topic"}>
                <form onSubmit={handleTopicSave} className="space-y-4">
                    <input type="text" required placeholder="Topic Name" value={topicFormData.name} onChange={e => setTopicFormData({...topicFormData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-indigo-500" />
                    <input type="text" required placeholder="Slug (e.g. arrays)" value={topicFormData.slug} onChange={e => setTopicFormData({...topicFormData, slug: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-mono focus:border-indigo-500" />
                    <textarea required placeholder="Summary" rows="3" value={topicFormData.summary} onChange={e => setTopicFormData({...topicFormData, summary: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white resize-none focus:border-indigo-500"></textarea>
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold">Save Topic</button>
                </form>
            </Modal>

            {/* CONTENT MODAL */}
            {isContentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsContentModalOpen(false)}></div>
                    <div className="relative bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-pink-400"/> {selectedContentId ? "Update Content Module" : "Create Content Module"}</h3>
                            <button onClick={() => setIsContentModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="content-form" onSubmit={handleContentSave} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Rich Summary / Markdown Text</label>
                                    <textarea required rows="10" placeholder="Enter your detailed content here..." value={contentFormData.summary} onChange={e => setContentFormData({...contentFormData, summary: e.target.value})} className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-mono text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"></textarea>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                        <h4 className="font-medium text-pink-300 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Attached Image URLs</h4>
                                        <button type="button" onClick={handleAddImage} className="text-xs bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus className="w-3 h-3"/> Add Image URL</button>
                                    </div>
                                    {contentFormData.images.map((img, index) => (
                                        <div key={index} className="flex gap-3">
                                            <input type="url" required placeholder="https://example.com/image.png" value={img} onChange={e => handleUpdateImage(index, e.target.value)} className="flex-1 p-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:border-pink-500" />
                                            <button type="button" onClick={() => handleRemoveImage(index)} className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {contentFormData.images.length === 0 && <p className="text-sm text-gray-500 text-center py-2">No images attached.</p>}
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsContentModalOpen(false)} className="py-2.5 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-bold">Cancel</button>
                            <button form="content-form" type="submit" className="py-2.5 px-8 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold">Save Content</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageContent;

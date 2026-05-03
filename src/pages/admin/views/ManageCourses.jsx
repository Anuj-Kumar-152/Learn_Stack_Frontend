import React, { useEffect, useState } from 'react';
import useCourseStore from '../../../store/useCourseStore';
import useCourseVideoStore from '../../../store/useCourseVideoStore';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { toast } from 'react-hot-toast';
import { BookOpen, Video, Plus, Save, X, ArrowLeft } from 'lucide-react';

const ManageCourses = () => {
    // Stores
    const { courses, isLoading: isCourseLoading, getAllCourses, createCourse, updateCourse, deleteCourse } = useCourseStore();
    const { videos, isLoading: isVideoLoading, getAllCourseVideos, createCourseVideo, updateCourseVideo, deleteCourseVideo } = useCourseVideoStore();

    // View State
    const [activeCourse, setActiveCourse] = useState(null); // If null, show courses. If set, show videos for this course.

    // Modal States
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // Form States
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [courseFormData, setCourseFormData] = useState({ title: '', name: '', summary: '', price: 0 });

    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [videoUploadType, setVideoUploadType] = useState('FILE'); // 'FILE' or 'URL'
    const [videoFormData, setVideoFormData] = useState({ title: '', summary: '', duration: '', video: null, videoUrl: '' });

    useEffect(() => {
        getAllCourses();
        getAllCourseVideos(); // Fetch all videos so we can filter them locally, or we could fetch by course ID if the backend supported it. The current store fetches all.
    }, []);

    // --- COURSE HANDLERS ---
    const handleCourseDelete = async (course) => {
        if (window.confirm(`Are you sure you want to delete course "${course.title}"?`)) {
            try {
                await deleteCourse(course._id);
                toast.success('Course deleted');
            } catch (e) {
                toast.error('Failed to delete course');
            }
        }
    };

    const handleCourseEditClick = (course) => {
        setCourseFormData({
            title: course.title,
            name: course.name,
            summary: course.summary,
            price: course.price || 0
        });
        setSelectedCourseId(course._id);
        setIsCourseModalOpen(true);
    };

    const handleCourseCreateClick = () => {
        setCourseFormData({ title: '', name: '', summary: '', price: 0 });
        setSelectedCourseId(null);
        setIsCourseModalOpen(true);
    };

    const handleCourseSave = async (e) => {
        e.preventDefault();
        try {
            if (selectedCourseId) {
                await updateCourse(selectedCourseId, courseFormData);
                toast.success('Course updated successfully');
            } else {
                await createCourse(courseFormData);
                toast.success('Course created successfully');
            }
            setIsCourseModalOpen(false);
        } catch (e) {
            toast.error(selectedCourseId ? 'Failed to update course' : 'Failed to create course');
        }
    };

    // --- VIDEO HANDLERS ---
    const handleVideoDelete = async (video) => {
        if (window.confirm(`Are you sure you want to delete video "${video.title}"?`)) {
            try {
                await deleteCourseVideo(video._id);
                toast.success('Video deleted');
            } catch (e) {
                toast.error('Failed to delete video');
            }
        }
    };

    const handleVideoCreateClick = () => {
        setVideoFormData({ title: '', summary: '', duration: '', video: null, videoUrl: '' });
        setVideoUploadType('FILE');
        setSelectedVideoId(null);
        setIsVideoModalOpen(true);
    };

    const handleVideoEditClick = (video) => {
        const isUrl = video.videoUrl && !video.videoUrl.includes('cloudinary'); // Rough heuristic, or just default to URL if we want. Actually, since Cloudinary gives a URL, we'll assume it's URL if there's no file object.
        
        setVideoFormData({
            title: video.title,
            summary: video.summary || '',
            duration: video.duration || '',
            video: null,
            videoUrl: video.videoUrl || ''
        });
        
        // If it starts with http and we want to allow editing the URL directly
        setVideoUploadType('URL');
        setSelectedVideoId(video._id);
        setIsVideoModalOpen(true);
    };

    const handleVideoSave = async (e) => {
        e.preventDefault();
        
        if (videoUploadType === 'FILE' && !selectedVideoId && !videoFormData.video) {
            toast.error("Please select a video file");
            return;
        }

        if (videoUploadType === 'URL' && !videoFormData.videoUrl.trim() && !selectedVideoId) {
            // Only require it on create if URL is selected
            toast.error("Please provide a valid video URL");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('courseId', activeCourse._id);
        formDataToSend.append('title', videoFormData.title);
        formDataToSend.append('summary', videoFormData.summary);
        formDataToSend.append('duration', videoFormData.duration);
        
        if (videoUploadType === 'FILE' && videoFormData.video) {
            formDataToSend.append('video', videoFormData.video);
        } else if (videoUploadType === 'URL' && videoFormData.videoUrl) {
            formDataToSend.append('videoUrl', videoFormData.videoUrl);
        }

        // We use a toast promise here since video uploads can take time
        const uploadPromise = selectedVideoId 
            ? updateCourseVideo(selectedVideoId, formDataToSend)
            : createCourseVideo(formDataToSend);

        toast.promise(uploadPromise, {
            loading: selectedVideoId ? 'Updating video...' : 'Uploading video... Please wait.',
            success: selectedVideoId ? 'Video updated successfully!' : 'Video uploaded successfully!',
            error: 'Failed to save video.'
        });

        try {
            await uploadPromise;
            setIsVideoModalOpen(false);
        } catch (error) {
            // Error handled by toast.promise
        }
    };

    // --- COLUMNS ---
    const courseColumns = [
        { header: 'Course Name', accessor: (row) => (
            <div>
                <div className="font-bold text-gray-200">{row.title}</div>
                <div className="text-xs text-gray-400">{row.name}</div>
            </div>
        )},
        { header: 'Price', accessor: (row) => (
            <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
                ${row.price || 0}
            </span>
        )},
        { header: 'Videos', accessor: (row) => (
            <button 
                onClick={() => setActiveCourse(row)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors text-sm font-semibold"
            >
                <Video className="w-4 h-4" /> Manage Videos
            </button>
        )},
    ];

    const videoColumns = [
        { header: 'Video Title', accessor: (row) => (
            <div className="font-bold text-gray-200">{row.title}</div>
        )},
        { header: 'Duration', accessor: (row) => (
            <span className="text-sm text-gray-400">{row.duration || 'N/A'}</span>
        )},
    ];

    // --- RENDER HELPERS ---
    const renderCourseView = () => (
        <>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            Manage Courses
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm ml-1">Create courses and manage their video curriculum.</p>
                </div>
                <button 
                    onClick={handleCourseCreateClick}
                    className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-300 hover:-translate-y-1"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Create Course
                </button>
            </div>

            <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <DataTable 
                    columns={courseColumns} 
                    data={courses} 
                    isLoading={isCourseLoading} 
                    onEdit={handleCourseEditClick}
                    onDelete={handleCourseDelete}
                />
            </div>
        </>
    );

    const renderVideoView = () => {
        // Filter videos for the active course
        const courseVideos = videos.filter(v => v.courseId === activeCourse._id);

        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                    onClick={() => setActiveCourse(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                </button>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl border border-pink-500/30">
                                <Video className="w-6 h-6 text-pink-400" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                {activeCourse.title}
                            </h1>
                        </div>
                        <p className="text-gray-400 text-sm ml-1">Manage video curriculum for this course.</p>
                    </div>
                    <button 
                        onClick={handleVideoCreateClick}
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all duration-300 hover:-translate-y-1"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Add Video
                    </button>
                </div>

                <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                    <DataTable 
                        columns={videoColumns} 
                        data={courseVideos} 
                        isLoading={isVideoLoading} 
                        onEdit={handleVideoEditClick}
                        onDelete={handleVideoDelete}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10">
                {activeCourse ? renderVideoView() : renderCourseView()}
            </div>

            {/* --- COURSE MODAL --- */}
            <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title={selectedCourseId ? "Update Course" : "Create New Course"}>
                <form onSubmit={handleCourseSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Course Title</label>
                        <input type="text" required value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Instructor / Author Name</label>
                        <input type="text" required value={courseFormData.name} onChange={e => setCourseFormData({...courseFormData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Price (USD)</label>
                        <input type="number" min="0" required value={courseFormData.price} onChange={e => setCourseFormData({...courseFormData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Summary</label>
                        <textarea required rows="3" value={courseFormData.summary} onChange={e => setCourseFormData({...courseFormData, summary: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsCourseModalOpen(false)} className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold border border-gray-700">Cancel</button>
                        <button type="submit" className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold">{selectedCourseId ? 'Update' : 'Save'}</button>
                    </div>
                </form>
            </Modal>

            {/* --- VIDEO MODAL --- */}
            <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="Upload Video">
                <form onSubmit={handleVideoSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Video Title</label>
                        <input type="text" required value={videoFormData.title} onChange={e => setVideoFormData({...videoFormData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Duration (e.g. 12:30)</label>
                        <input type="text" value={videoFormData.duration} onChange={e => setVideoFormData({...videoFormData, duration: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Summary</label>
                        <textarea rows="2" value={videoFormData.summary} onChange={e => setVideoFormData({...videoFormData, summary: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"></textarea>
                    </div>

                    {/* Source Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Video Source</label>
                        <div className="flex gap-4 mb-4 bg-gray-900/50 p-1.5 rounded-xl border border-gray-700">
                            <button
                                type="button"
                                onClick={() => setVideoUploadType('FILE')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${videoUploadType === 'FILE' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Upload File
                            </button>
                            <button
                                type="button"
                                onClick={() => setVideoUploadType('URL')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${videoUploadType === 'URL' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                External URL
                            </button>
                        </div>

                        {videoUploadType === 'FILE' ? (
                            <div>
                                <input type="file" accept="video/*" required={!selectedVideoId} onChange={e => setVideoFormData({...videoFormData, video: e.target.files[0]})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30" />
                            </div>
                        ) : (
                            <div>
                                <input type="url" placeholder="https://example.com/video.mp4" required value={videoFormData.videoUrl} onChange={e => setVideoFormData({...videoFormData, videoUrl: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsVideoModalOpen(false)} className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold border border-gray-700">Cancel</button>
                        <button type="submit" className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold">Upload</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageCourses;

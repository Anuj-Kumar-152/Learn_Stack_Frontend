import React, { useEffect, useState } from 'react';
import { GraduationCap, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import useCollegeStore from '../../../store/useCollegeStore';

const initialFormState = {
    name: '',
    slug: '',
    location: '',
    state: '',
    country: '',
    summary: '',
    collegeIcon: '',
    collegeCoverImage: ''
};

const ManageColleges = () => {
    const { colleges, isLoading, getAllColleges, createCollege, updateCollege, deleteCollege } = useCollegeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        getAllColleges();
    }, []);

    const columns = [
        { header: 'College', accessor: (row) => <div className="font-bold capitalize text-gray-200">{row.name}</div> },
        { header: 'Slug', accessor: (row) => <span className="font-mono text-sm text-gray-400">{row.slug}</span> },
        { header: 'Location', accessor: (row) => <span className="text-gray-300">{[row.location, row.state, row.country].filter(Boolean).join(', ') || 'NA'}</span> }
    ];

    const handleCreateClick = () => {
        setFormData(initialFormState);
        setSelectedCollegeId(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (college) => {
        setFormData({
            name: college.name || '',
            slug: college.slug || '',
            location: college.location || '',
            state: college.state || '',
            country: college.country || '',
            summary: college.summary || '',
            collegeIcon: college.collegeIcon || '',
            collegeCoverImage: college.collegeCoverImage || ''
        });
        setSelectedCollegeId(college._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (college) => {
        if (!window.confirm(`Delete college "${college.name}"?`)) return;

        try {
            await deleteCollege(college._id);
            toast.success('College deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete college');
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            if (selectedCollegeId) {
                await updateCollege(selectedCollegeId, formData);
                toast.success('College updated');
            } else {
                await createCollege(formData);
                toast.success('College created');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save college');
        }
    };

    const setField = (field, value) => setFormData({ ...formData, [field]: value });

    return (
        <div className="relative min-h-screen pb-10">
            <div className="relative z-10">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-2">
                                <GraduationCap className="h-6 w-6 text-violet-400" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-white">Manage Colleges</h1>
                        </div>
                        <p className="text-sm text-gray-400">Add and maintain college names, locations, and branding.</p>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-violet-500"
                    >
                        <Plus className="h-4 w-4" />
                        Add College
                    </button>
                </div>

                <DataTable columns={columns} data={colleges} isLoading={isLoading} onEdit={handleEditClick} onDelete={handleDelete} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCollegeId ? 'Update College' : 'Create College'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <input required value={formData.name} onChange={event => setField('name', event.target.value)} placeholder="College name" className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                    <input required value={formData.slug} onChange={event => setField('slug', event.target.value)} placeholder="Slug e.g. iit-delhi" className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 font-mono text-white outline-none focus:border-violet-500" />
                    <div className="grid gap-3 md:grid-cols-3">
                        <input value={formData.location} onChange={event => setField('location', event.target.value)} placeholder="City" className="rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                        <input value={formData.state} onChange={event => setField('state', event.target.value)} placeholder="State" className="rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                        <input value={formData.country} onChange={event => setField('country', event.target.value)} placeholder="Country" className="rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                    </div>
                    <textarea value={formData.summary} onChange={event => setField('summary', event.target.value)} placeholder="Summary" rows="3" className="w-full resize-none rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                    <input value={formData.collegeIcon} onChange={event => setField('collegeIcon', event.target.value)} placeholder="College icon URL" className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                    <input value={formData.collegeCoverImage} onChange={event => setField('collegeCoverImage', event.target.value)} placeholder="College cover image URL" className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white outline-none focus:border-violet-500" />
                    <button type="submit" className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-500">
                        Save College
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManageColleges;

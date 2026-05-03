import React, { useEffect, useState } from 'react';
import useUserStore from '../../../store/useUserStore';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { toast } from 'react-hot-toast';

const ManageUsers = () => {
    const { users, isLoading, getAllUsers, updateUser, createUser, deleteUser } = useUserStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state for creating staff
    const [formData, setFormData] = useState({
        name: '', username: '', email: '', password: '', role: 'EMPLOYEE'
    });

    useEffect(() => {
        getAllUsers();
    }, []);

    const columns = [
        { header: 'Name', accessor: (row) => row.name },
        { header: 'Email', accessor: (row) => row.email },
        {
            header: 'Role',
            accessor: (row) => (
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${row.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                        row.role === 'EMPLOYEE' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {row.role}
                </span>
            )
        },
        {
            header: 'MFA Status',
            accessor: (row) => row.isMFA ? 'Enabled' : 'Disabled'
        }
    ];

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
            try {
                await deleteUser(user._id);
                toast.success(`User ${user.name} deleted successfully`);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            toast.success(`${formData.role} created successfully!`);
            setIsModalOpen(false);
            setFormData({ name: '', username: '', email: '', password: '', role: 'EMPLOYEE' });
        } catch (error) {
            toast.error('Failed to create user');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Users</h1>
                    <p className="text-gray-500 mt-1">Add staff and monitor accounts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-lg shadow-indigo-500/30"
                >
                    Create Staff Account
                </button>
            </div>

            <DataTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                onDelete={handleDeleteUser}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Admin/Employee">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold">
                        Create Account
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManageUsers;

import React, { useEffect, useState } from 'react';
import useProblemStore from '../../../store/useProblemStore';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { toast } from 'react-hot-toast';
import { Code2, Sparkles, Save, X, Plus, Trash2, Link, Terminal, Play } from 'lucide-react';

const initialFormState = {
    title: '',
    slug: '',
    summary: '',
    level: 'EASY',
    timeComplexity: '',
    hint: '',
    referenceUrls: [],
    examples: [],
    snippets: []
};

const languageBoilerplates = {
    javascript: 'function solve(input) {\n    // Write your code here\n    return result;\n}',
    typescript: 'function solve(input: string): string {\n    // Write your code here\n    return result;\n}',
    python: 'def solve(input):\n    # Write your code here\n    return result',
    java: 'class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    csharp: 'public class Solution {\n    public void Solve() {\n        // Write your code here\n    }\n}',
    go: 'package main\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n}',
    rust: 'fn main() {\n    // Write your code here\n}',
    kotlin: 'fun main(args: Array<String>) {\n    // Write your code here\n}',
    swift: 'func solve() {\n    // Write your code here\n}',
    ruby: 'def solve(input)\n    # Write your code here\nend',
    php: '<?php\nfunction solve($input) {\n    // Write your code here\n}\n?>',
    scala: 'object Solution {\n    def main(args: Array[String]) {\n        // Write your code here\n    }\n}',
    dart: 'void main() {\n    // Write your code here\n}'
};

const ManageProblems = () => {
    const { problems, isLoading, getAllProblems, createProblem, updateProblem, deleteProblem } = useProblemStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        getAllProblems();
    }, []);

    const columns = [
        { header: 'Title', accessor: (row) => (
            <div className="font-semibold text-gray-200">{row.title}</div>
        )},
        { header: 'Slug', accessor: (row) => (
            <div className="text-gray-400 text-sm font-mono bg-gray-800/50 px-2 py-1 rounded-md inline-block border border-gray-700">{row.slug}</div>
        )},
        { 
            header: 'Level', 
            accessor: (row) => (
                <span className={`px-3 py-1 text-xs font-black tracking-wider rounded-full shadow-lg ${
                    row.level === 'HARD' ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/20' :
                    row.level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/20'
                }`}>
                    {row.level}
                </span>
            ) 
        },
    ];

    const handleDelete = async (problem) => {
        if (window.confirm(`Are you absolutely sure you want to delete "${problem.title}"? This cannot be undone.`)) {
            try {
                await deleteProblem(problem._id);
                toast.success('Problem deleted successfully');
            } catch (e) {
                toast.error('Failed to delete problem');
            }
        }
    };

    const handleEditClick = (problem) => {
        setFormData({
            title: problem.title || '',
            slug: problem.slug || '',
            summary: problem.summary || '',
            level: problem.level || 'EASY',
            timeComplexity: problem.timeComplexity || '',
            hint: problem.hint || '',
            referenceUrls: problem.referenceUrls || [],
            examples: problem.examples || [],
            snippets: problem.snippets || []
        });
        setSelectedProblemId(problem._id);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setFormData(initialFormState);
        setSelectedProblemId(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (selectedProblemId) {
                await updateProblem(selectedProblemId, formData);
                toast.success('Problem updated successfully');
            } else {
                await createProblem(formData);
                toast.success('Problem created successfully');
            }
            setIsModalOpen(false);
            setFormData(initialFormState);
            setSelectedProblemId(null);
        } catch (e) {
            toast.error(selectedProblemId ? 'Failed to update problem' : 'Failed to create problem');
        }
    };

    // --- Dynamic Array Handlers ---
    const handleAddReference = () => {
        setFormData({ ...formData, referenceUrls: [...formData.referenceUrls, { platformName: '', url: '' }] });
    };
    const handleUpdateReference = (index, field, value) => {
        const newRefs = [...formData.referenceUrls];
        newRefs[index][field] = value;
        setFormData({ ...formData, referenceUrls: newRefs });
    };
    const handleRemoveReference = (index) => {
        setFormData({ ...formData, referenceUrls: formData.referenceUrls.filter((_, i) => i !== index) });
    };

    const handleAddExample = () => {
        setFormData({ ...formData, examples: [...formData.examples, { input: '', output: '', summary: '' }] });
    };
    const handleUpdateExample = (index, field, value) => {
        const newExs = [...formData.examples];
        newExs[index][field] = value;
        setFormData({ ...formData, examples: newExs });
    };
    const handleRemoveExample = (index) => {
        setFormData({ ...formData, examples: formData.examples.filter((_, i) => i !== index) });
    };

    const handleAddSnippet = () => {
        setFormData({ ...formData, snippets: [...formData.snippets, { languageName: '', snippet: '' }] });
    };
    const handleUpdateSnippet = (index, field, value) => {
        const newSnips = [...formData.snippets];
        newSnips[index][field] = value;
        setFormData({ ...formData, snippets: newSnips });
    };
    const handleRemoveSnippet = (index) => {
        setFormData({ ...formData, snippets: formData.snippets.filter((_, i) => i !== index) });
    };

    return (
        <div className="relative min-h-screen pb-10">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
                                <Code2 className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Manage Problems
                            </h1>
                        </div>
                        <p className="text-gray-400 text-sm ml-1">Add, edit, and organize dynamic coding challenges.</p>
                    </div>
                    <button 
                        onClick={handleCreateClick}
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-300 hover:-translate-y-1"
                    >
                        <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                        Create Problem
                    </button>
                </div>

                <div className="backdrop-blur-xl bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                    <DataTable 
                        columns={columns} 
                        data={problems} 
                        isLoading={isLoading} 
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Custom Full-Screen Overlay Modal for Large Forms */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        
                        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-900/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-indigo-400"/>
                                {selectedProblemId ? "Update Problem" : "Create New Problem"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="problem-form" onSubmit={handleSave} className="space-y-8">
                                
                                {/* Section: Basic Info */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-indigo-300 border-b border-gray-700 pb-2">Basic Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Problem Title</label>
                                            <input type="text" placeholder="e.g. Two Sum" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">URL Slug</label>
                                            <input type="text" placeholder="e.g. two-sum" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Difficulty Level</label>
                                            <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none">
                                                <option value="EASY">Easy</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HARD">Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Time Complexity</label>
                                            <input type="text" placeholder="e.g. O(N)" value={formData.timeComplexity} onChange={e => setFormData({...formData, timeComplexity: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Problem Hint (Optional)</label>
                                        <textarea placeholder="Provide a hint to help students if they get stuck..." rows="2" value={formData.hint} onChange={e => setFormData({...formData, hint: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Problem Summary</label>
                                        <textarea placeholder="Provide a detailed description of the problem..." required rows="4" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"></textarea>
                                    </div>
                                </div>

                                {/* Section: Examples */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                                        <h4 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                                            <Play className="w-4 h-4"/> Examples
                                        </h4>
                                        <button type="button" onClick={handleAddExample} className="text-sm flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-lg">
                                            <Plus className="w-4 h-4"/> Add Example
                                        </button>
                                    </div>
                                    {formData.examples.map((ex, index) => (
                                        <div key={index} className="p-4 bg-gray-900/50 border border-gray-700 rounded-xl relative group">
                                            <button type="button" onClick={() => handleRemoveExample(index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-5 h-5"/>
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Input</label>
                                                    <input type="text" required value={ex.input} onChange={e => handleUpdateExample(index, 'input', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Output</label>
                                                    <input type="text" required value={ex.output} onChange={e => handleUpdateExample(index, 'output', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Explanation (Optional)</label>
                                                    <input type="text" value={ex.summary} onChange={e => handleUpdateExample(index, 'summary', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.examples.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No examples added yet.</p>}
                                </div>

                                {/* Section: Snippets */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                                        <h4 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                                            <Terminal className="w-4 h-4"/> Code Snippets
                                        </h4>
                                        <button type="button" onClick={handleAddSnippet} className="text-sm flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-lg">
                                            <Plus className="w-4 h-4"/> Add Snippet
                                        </button>
                                    </div>
                                    {formData.snippets.map((snip, index) => (
                                        <div key={index} className="p-4 bg-gray-900/50 border border-gray-700 rounded-xl relative group">
                                            <button type="button" onClick={() => handleRemoveSnippet(index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-5 h-5"/>
                                            </button>
                                            <div className="pr-8 space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Programming Language</label>
                                                    <select required value={snip.languageName} onChange={e => handleUpdateSnippet(index, 'languageName', e.target.value)} className="w-full md:w-1/2 p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none">
                                                        <option value="" disabled>Select a Language</option>
                                                        <option value="javascript">JavaScript</option>
                                                        <option value="typescript">TypeScript</option>
                                                        <option value="python">Python</option>
                                                        <option value="java">Java</option>
                                                        <option value="cpp">C++</option>
                                                        <option value="c">C</option>
                                                        <option value="csharp">C#</option>
                                                        <option value="go">Go</option>
                                                        <option value="rust">Rust</option>
                                                        <option value="kotlin">Kotlin</option>
                                                        <option value="swift">Swift</option>
                                                        <option value="ruby">Ruby</option>
                                                        <option value="php">PHP</option>
                                                        <option value="scala">Scala</option>
                                                        <option value="dart">Dart</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1 flex justify-between">
                                                        <span>Starter Code Snippet</span>
                                                        <span className="text-indigo-400 opacity-70">Monospace</span>
                                                    </label>
                                                    <div className="relative rounded-xl overflow-hidden border border-gray-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 shadow-inner bg-[#0d1117]">
                                                        {/* Optional aesthetic top bar for the code editor look */}
                                                        <div className="flex px-3 py-2 bg-[#161b22] border-b border-gray-700 gap-1.5">
                                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                                        </div>
                                                        <textarea rows="6" required value={snip.snippet} onChange={e => handleUpdateSnippet(index, 'snippet', e.target.value)} spellCheck="false" placeholder={languageBoilerplates[snip.languageName] || "function solve() {\n    // Write your code here\n}"} className="w-full p-4 bg-transparent text-gray-300 font-mono text-[13px] leading-relaxed focus:outline-none resize-none placeholder-gray-600/50"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.snippets.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No starter snippets added yet.</p>}
                                </div>

                                {/* Section: Reference URLs */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                                        <h4 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                                            <Link className="w-4 h-4"/> Reference Links
                                        </h4>
                                        <button type="button" onClick={handleAddReference} className="text-sm flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-lg">
                                            <Plus className="w-4 h-4"/> Add Link
                                        </button>
                                    </div>
                                    {formData.referenceUrls.map((ref, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <input type="text" required placeholder="Platform (e.g. LeetCode)" value={ref.platformName} onChange={e => handleUpdateReference(index, 'platformName', e.target.value)} className="w-1/3 p-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                            <input type="url" required placeholder="URL" value={ref.url} onChange={e => handleUpdateReference(index, 'url', e.target.value)} className="flex-1 p-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                            <button type="button" onClick={() => handleRemoveReference(index)} className="p-2.5 text-gray-500 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    ))}
                                    {formData.referenceUrls.length === 0 && <p className="text-sm text-gray-500 text-center py-2">No references added yet.</p>}
                                </div>

                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50 flex gap-3 justify-end">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="py-2.5 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors border border-gray-700">
                                Cancel
                            </button>
                            <button form="problem-form" type="submit" className="py-2.5 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all">
                                {selectedProblemId ? 'Update Problem' : 'Save Problem'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProblems;

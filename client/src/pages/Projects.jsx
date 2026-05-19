import { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import AddEditModal from '../components/AddEditModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { Plus, FolderOpen, Users, CheckCircle, Loader2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({ title: '', description: '' });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects', formData);
      toast.success('Project created successfully');
      setIsFormOpen(false);
      setFormData({ title: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.tasks?.length > 0).length,
    totalTasks: projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Projects
            </h1>
            <p className="text-slate-600">Manage your projects and track progress</p>
          </div>

         
          {/* Header with Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">All Projects</h2>
            {user?.role === 'admin' && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 font-medium text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Project
              </button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-lg border border-slate-200">
              <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg mb-2">No projects found</p>
              {user?.role === 'admin' && (
                <button
                  onClick={handleCreate}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                >
                  Create your first project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}

          {/* Add Project Modal */}
          <AddEditModal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            title="Create New Project"
            onSubmit={handleSubmit}
            submitting={submitting}
            submitText="Create Project"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </AddEditModal>
        </div>
      </div>
    </div>
  );
};

export default Projects;

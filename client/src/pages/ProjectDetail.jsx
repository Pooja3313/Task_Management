import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import AddEditModal from "../components/AddEditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Users } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  });
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);

  // Fetch members for Assign To dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/users/members");
        setMembers(response.data.data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  // Delete modals state
  const [deleteTaskModal, setDeleteTaskModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });
  const [deleteProjectModal, setDeleteProjectModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data.project);
      setTasks(response.data.data.tasks);
    } catch (error) {
      toast.error("Failed to fetch project data");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "",
      dueDate: "",
    });
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo?._id || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setIsTaskFormOpen(true);
  };

  const handleEditProject = () => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
    });
    setIsProjectFormOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSubmit = {
        ...taskFormData,
        project: id,
        assignedTo: taskFormData.assignedTo || undefined,
        dueDate: taskFormData.dueDate || undefined,
      };

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, dataToSubmit);
        toast.success("Task updated successfully");
      } else {
        await api.post("/tasks", dataToSubmit);
        toast.success("Task created successfully");
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProject) {
        await api.put(`/projects/${id}`, projectFormData);
        toast.success("Project updated successfully");
      }
      setIsProjectFormOpen(false);
      setEditingProject(null);
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ? Task delete ? modal open (window.confirm hata diya)
  const handleDeleteTask = (taskId, taskTitle) => {
    setDeleteTaskModal({ isOpen: true, taskId, taskTitle });
  };

  // ? Task delete confirm
  const confirmDeleteTask = async () => {
    setDeleting(true);
    try {
      await api.delete(`/tasks/${deleteTaskModal.taskId}`);
      toast.success("Task deleted successfully");
      setDeleteTaskModal({ isOpen: false, taskId: null, taskTitle: "" });
      fetchProjectData();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success("Task status updated");
      fetchProjectData();
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  // ? Project delete confirm (window.confirm hata diya)
  const confirmDeleteProject = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
      setDeleteProjectModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const canEdit = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 scrollbar-hide overflow-x-hidden">
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>

          {/* Project Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                {project?.title}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg">
                {project?.description}
              </p>
              <div className="mt-4 flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      Members
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                      {project?.members?.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/30">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Tasks</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                      {tasks.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2 w-full sm:w-auto ml-auto sm:ml-8">
                <button
                  onClick={handleEditProject}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm whitespace-nowrap"
                >
                  <Edit className="w-4 h-4" />
                  Edit Project
                </button>
                <button
                  onClick={() => setDeleteProjectModal(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md text-sm whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            )}
          </div>

          {/* Tasks Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Tasks
            </h2>
            {canEdit && (
              <button
                onClick={handleCreateTask}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-lg border border-slate-200">
              <p className="text-gray-600 text-base sm:text-lg">
                No tasks found
              </p>
              {canEdit && (
                <button
                  onClick={handleCreateTask}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                >
                  Create your first task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={(taskId) => handleDeleteTask(taskId, task.title)}
                  onStatusChange={handleStatusChange}
                  canEdit={canEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Add/Edit Modal */}
      <AddEditModal
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit Task" : "Create New Task"}
        onSubmit={handleTaskSubmit}
        submitting={submitting}
        submitText={editingTask ? "Update Task" : "Create Task"}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={taskFormData.title}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, title: e.target.value })
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={taskFormData.description}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  description: e.target.value,
                })
              }
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={taskFormData.status}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={taskFormData.priority}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, priority: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Assign To
            </label>
            <select
              name="assignedTo"
              value={taskFormData.assignedTo}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, assignedTo: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Unassigned</option>
              {members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={taskFormData.dueDate}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, dueDate: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </AddEditModal>

      {/* Project Edit Modal */}
      <AddEditModal
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        title="Edit Project"
        onSubmit={handleProjectSubmit}
        submitting={submitting}
        submitText="Update Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={projectFormData.title}
              onChange={(e) =>
                setProjectFormData({
                  ...projectFormData,
                  title: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={projectFormData.description}
              onChange={(e) =>
                setProjectFormData({
                  ...projectFormData,
                  description: e.target.value,
                })
              }
              rows="4"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </AddEditModal>

      {/* Delete Task Modal */}
      <DeleteConfirmModal
        isOpen={deleteTaskModal.isOpen}
        onClose={() =>
          setDeleteTaskModal({ isOpen: false, taskId: null, taskTitle: "" })
        }
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteTaskModal.taskTitle}</strong>? This action cannot be
            undone.
          </>
        }
        submitting={deleting}
      />

      {/* Delete Project Modal */}
      <DeleteConfirmModal
        isOpen={deleteProjectModal}
        onClose={() => setDeleteProjectModal(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={
          <>
            Are you sure you want to delete <strong>{project?.title}</strong>?
            This will also delete all associated tasks.
          </>
        }
        submitting={deleting}
      />
    </div>
  );
};

export default ProjectDetail;

import { Edit2, Trash2, Calendar, User, Clock } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, canEdit }) => {
  const statusConfig = {
    'todo': {
      label: 'To Do',
      bg: 'bg-gradient-to-r from-slate-500 to-slate-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-slate-500/30'
    },
    'in-progress': {
      label: 'In Progress',
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-blue-500/30'
    },
    'completed': {
      label: 'Completed',
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-green-500/30'
    }
  };

  const priorityConfig = {
    'low': {
      label: 'Low',
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-emerald-500/30'
    },
    'medium': {
      label: 'Medium',
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-amber-500/30'
    },
    'high': {
      label: 'High',
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      text: 'text-white',
      shadow: 'shadow-md shadow-red-500/30'
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-base sm:text-lg font-semibold text-slate-900 flex-1 pr-2 sm:pr-4 line-clamp-2">{task.title}</h4>
          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow-md hover:shadow-blue-500/30 transition-all"
                title="Edit Task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-md hover:shadow-red-500/30 transition-all"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {task.description && (
          <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{task.description}</p>
        )}

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${statusConfig[task.status].bg} ${statusConfig[task.status].text} ${statusConfig[task.status].shadow}`}>
            {statusConfig[task.status].label}
          </span>
          <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text} ${priorityConfig[task.priority].shadow}`}>
            {priorityConfig[task.priority].label}
          </span>
        </div>

        {/* Assigned To and Due Date */}
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          {task.assignedTo && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="font-medium truncate">{task.assignedTo.name}</span>
            </div>
          )}
          <div className={`flex items-center gap-2 text-xs sm:text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="truncate">{formatDate(task.dueDate)}</span>
            {isOverdue && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium whitespace-nowrap">Overdue</span>
            )}
          </div>
        </div>

        {/* Status Change Dropdown */}
        {onStatusChange && (
          <div className="pt-3 sm:pt-4 border-t border-slate-200">
            <label className="block text-xs font-medium text-slate-500 mb-2">Update Status</label>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

import { NavLink } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <NavLink to={`/projects/${project._id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {project.members.length} member{project.members.length !== 1 ? 's' : ''}
          </span>
          <span className="text-blue-600 hover:text-blue-800">View Details →</span>
        </div>
      </div>
    </NavLink>
  );
};

export default ProjectCard;

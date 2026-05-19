import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink
              to="/dashboard"
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              TeamTask
            </NavLink>
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 items-baseline space-x-1">
              <NavLink
                to="/dashboard"
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-md font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                Dashboard
              </NavLink>
           
              {user?.role !== "admin" && (
                <NavLink
                  to="/tasks/my-tasks"
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-md font-medium transition-all duration-200 ${
                    isActive("/tasks/my-tasks")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  My Tasks
                </NavLink>
              )}
              {user?.role === "admin" && (
                <>
                   <NavLink
                to="/projects"
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-md font-medium transition-all duration-200 ${
                  isActive("/projects") || isActive("/projects/")
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                Projects
              </NavLink>
                <NavLink
                  to="/admin/users"
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-md font-medium transition-all duration-200 ${
                    isActive("/admin/users")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  Users
                </NavLink>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-200">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`hidden md:block w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/projects") || isActive("/projects/")
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                Projects
              </NavLink>
              {user?.role !== "admin" && (
                <NavLink
                  to="/tasks/my-tasks"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/tasks/my-tasks")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  My Tasks
                </NavLink>
              )}
              {user?.role === "admin" && (
                <NavLink
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/admin/users")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  Users
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

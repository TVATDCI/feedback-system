/**
 * Dashboard Page
 * Welcome page with quick actions
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const routePrefix = isAdmin ? "/admin" : "/user";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.email}!
          </h1>
          <p className="mt-2 text-gray-600">
            {isAdmin ? (
              <>
                You have{" "}
                <span className="font-semibold text-primary-600">
                  admin access
                </span>
                . You can manage all users and feedback.
              </>
            ) : (
              <>You can submit and view your feedback.</>
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to={`${routePrefix}/feedback`} className="card-hover group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isAdmin ? "Manage Feedback" : "Your Feedback"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isAdmin
                    ? "View and manage all feedback submissions"
                    : "View your feedback history or submit new feedback"}
                </p>
              </div>
            </div>
          </Link>

          {isAdmin && (
            <Link to="/admin/users" className="card-hover group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Manage Users
                  </h2>
                  <p className="text-sm text-gray-500">
                    Create, edit, and manage user accounts
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Info Section */}
        <div className="card bg-gray-50 border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {isAdmin ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  You can change feedback status from the Feedback page
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  New users can be created from the Users page
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  All actions are logged for audit purposes
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Submit feedback to help us improve our services
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  You can view the status of your submitted feedback
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  Use categories to help organize your feedback
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;

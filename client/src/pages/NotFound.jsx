/**
 * Not Found Page
 * 404 error page for unknown routes
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";

function NotFound() {
  const { isAdmin } = useAuth();
  const dashboardPath = isAdmin ? "/admin" : "/user";

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to={dashboardPath} className="btn-primary mt-6 inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;

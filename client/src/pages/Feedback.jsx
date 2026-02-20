/**
 * Feedback Page
 * View and manage feedback
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as feedbackService from "../services/feedbackService";
import Layout from "../components/layout/Layout";

function Feedback() {
  const { user, isAdmin } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ message: "", category: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [user, isAdmin]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await feedbackService.getAllFeedback()
        : await feedbackService.getFeedbackByUser(user.id || user._id);
      setFeedback(data.feedback || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await feedbackService.createFeedback(formData);
      setFormData({ message: "", category: "" });
      setShowForm(false);
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await feedbackService.updateFeedback(id, { status });
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update feedback");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      await feedbackService.deleteFeedback(id);
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete feedback");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "badge-pending",
      reviewed: "badge-reviewed",
      archived: "badge-archived",
    };
    return styles[status] || "badge-pending";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
            <p className="text-gray-600">
              {isAdmin
                ? "Manage all feedback"
                : "View and submit your feedback"}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? "Cancel" : "New Feedback"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert-error">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* New Feedback Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Submit New Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="label">
                  Category (optional)
                </label>
                <input
                  id="category"
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Bug, Feature Request, General"
                />
              </div>
              <div>
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="input min-h-[120px]"
                  placeholder="Describe your feedback..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner w-8 h-8 border-primary-600" />
          </div>
        ) : feedback.length === 0 ? (
          <div className="card text-center py-12">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No feedback yet
            </h3>
            <p className="mt-2 text-gray-500">
              Submit your first feedback to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item._id} className="card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={getStatusBadge(item.status)}>
                        {item.status}
                      </span>
                      {item.category && (
                        <span className="text-sm text-gray-500">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900">{item.message}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {isAdmin && item.userId && (
                        <span>By: {item.userId.email} • </span>
                      )}
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusUpdate(item._id, e.target.value)
                        }
                        className="input py-1 px-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Feedback;

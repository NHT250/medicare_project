import React, { useEffect, useState } from "react";

import adminApi from "../api";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_users: 0,
    total_orders: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await adminApi.dashboard.summary();
        setSummary(data || {});
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-muted">Total Users</h5>
            <p className="display-6 fw-bold">{summary.total_users}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-muted">Total Orders</h5>
            <p className="display-6 fw-bold">{summary.total_orders}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-muted">Total Revenue</h5>
            <p className="display-6 fw-bold">${summary.total_revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

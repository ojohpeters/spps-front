import React, { useState, useEffect } from 'react';
import { dashboardAPI, predictionAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [predictionStats, setPredictionStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, predStatsRes] = await Promise.all([
        dashboardAPI.getStats(),
        predictionAPI.getStatistics(),
      ]);
      setStats(dashboardRes.data);
      setPredictionStats(predStatsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '2rem' }}>
        <h1 className="card-title">Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Academic performance prediction analytics and insights
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats?.total_students || 0}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Predictions Generated</div>
          <div className="stat-value">{stats?.total_predictions || 0}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">At-Risk Students</div>
          <div className="stat-value" style={{ color: 'var(--burgundy)' }}>
            {stats?.at_risk_students || 0}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">High Achievers</div>
          <div className="stat-value" style={{ color: 'var(--sage)' }}>
            {stats?.high_achievers || 0}
          </div>
        </div>
      </div>

      {predictionStats && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Risk Distribution</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                High Achievers
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#155724' }}>
                {predictionStats.risk_percentages?.high_achiever || 0}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Average Performance
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#856404' }}>
                {predictionStats.risk_percentages?.average || 0}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                At Risk
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#721c24' }}>
                {predictionStats.risk_percentages?.at_risk || 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {stats?.recent_predictions && stats.recent_predictions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Predictions</h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Predicted CGPA</th>
                  <th>Risk Level</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_predictions.map((pred) => (
                  <tr key={pred.id}>
                    <td className="monospace">{pred.student_id}</td>
                    <td>{pred.student_name}</td>
                    <td className="monospace">{pred.predicted_cgpa.toFixed(2)}</td>
                    <td>
                      <span className={`risk-badge risk-${pred.risk_level.replace('_', '-')}`}>
                        {pred.risk_level.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="monospace">
                      {new Date(pred.predicted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

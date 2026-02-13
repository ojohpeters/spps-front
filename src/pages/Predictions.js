import React, { useState, useEffect } from 'react';
import { predictionAPI, studentAPI, factorsAPI } from '../services/api';

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [semester, setSemester] = useState('Current');
  const [filterRisk, setFilterRisk] = useState('');

  useEffect(() => {
    loadData();
  }, [filterRisk]);

  const loadData = async () => {
    try {
      const params = filterRisk ? { risk_level: filterRisk } : {};
      const [predRes, studRes] = await Promise.all([
        predictionAPI.getAll(params),
        studentAPI.getAll(),
      ]);
      setPredictions(predRes.data);
      setStudents(studRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    setGenerating(true);
    try {
      await predictionAPI.generate(selectedStudent, semester);
      setShowForm(false);
      setSelectedStudent('');
      loadData();
      alert('Prediction generated successfully!');
    } catch (error) {
      alert('Failed to generate prediction: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    return `risk-badge risk-${riskLevel.replace('_', '-')}`;
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="card-title">Performance Predictions</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Generate and view academic performance predictions
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Generate Prediction'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Generate New Prediction</h2>
          </div>
          <form onSubmit={handleGenerate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Select Student</label>
                <select
                  className="form-select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                >
                  <option value="">-- Select Student --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.student_id}>
                      {student.student_id} - {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select
                  className="form-select"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="Current">Current Semester</option>
                  <option value="Next">Next Semester</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={generating}>
                {generating ? 'Generating...' : 'Generate Prediction'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">All Predictions ({predictions.length})</h2>
            <div>
              <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Filter by Risk:</label>
              <select
                className="form-select"
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                style={{ width: 'auto', display: 'inline-block' }}
              >
                <option value="">All Levels</option>
                <option value="at_risk">At Risk</option>
                <option value="average">Average</option>
                <option value="high_achiever">High Achiever</option>
              </select>
            </div>
          </div>
        </div>
        
        {predictions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No predictions found. Generate your first prediction to get started.
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Predicted CGPA</th>
                  <th>Risk Level</th>
                  <th>Confidence</th>
                  <th>Semester</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred.id}>
                    <td className="monospace">
                      {pred.student_details?.student_id}
                    </td>
                    <td>
                      {pred.student_details?.first_name} {pred.student_details?.last_name}
                    </td>
                    <td className="monospace" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                      {pred.predicted_cgpa.toFixed(2)}
                    </td>
                    <td>
                      <span className={getRiskClass(pred.risk_level)}>
                        {pred.risk_level_display}
                      </span>
                    </td>
                    <td className="monospace">{pred.confidence_score.toFixed(1)}%</td>
                    <td>{pred.semester}</td>
                    <td className="monospace">
                      {new Date(pred.predicted_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Predictions;

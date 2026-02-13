import React, { useState, useEffect } from 'react';
import { studentAPI, factorsAPI } from '../services/api';

function Factors() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    attendance_percentage: 80,
    assignment_average: 70,
    study_hours_per_week: 15,
    socioeconomic_status: 'medium',
    extracurricular_participation: false,
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFactors = async (studentId) => {
    const student = students.find(s => s.id === parseInt(studentId));
    if (student && student.factors) {
      setFormData({
        attendance_percentage: student.factors.attendance_percentage,
        assignment_average: student.factors.assignment_average,
        study_hours_per_week: student.factors.study_hours_per_week,
        socioeconomic_status: student.factors.socioeconomic_status,
        extracurricular_participation: student.factors.extracurricular_participation,
      });
    } else {
      setFormData({
        attendance_percentage: 80,
        assignment_average: 70,
        study_hours_per_week: 15,
        socioeconomic_status: 'medium',
        extracurricular_participation: false,
      });
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    if (studentId) {
      loadFactors(studentId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    setSaving(true);
    try {
      const student = students.find(s => s.id === parseInt(selectedStudent));
      const payload = { ...formData, student: student.id };

      if (student.factors) {
        await factorsAPI.update(student.factors.id, payload);
      } else {
        await factorsAPI.create(payload);
      }

      alert('Factors saved successfully!');
      loadStudents();
    } catch (error) {
      alert('Failed to save factors: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '2rem' }}>
        <h1 className="card-title">Additional Performance Factors</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Input additional factors that influence academic performance prediction
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Factor Input Form</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Student</label>
            <select
              className="form-select"
              value={selectedStudent}
              onChange={handleStudentChange}
              required
            >
              <option value="">-- Select a Student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.student_id} - {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    Attendance Percentage
                    <span className="monospace" style={{ marginLeft: '1rem', fontWeight: 'normal' }}>
                      ({formData.attendance_percentage}%)
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.attendance_percentage}
                    onChange={(e) => setFormData({ ...formData, attendance_percentage: parseFloat(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                  <input
                    type="number"
                    className="form-input"
                    value={formData.attendance_percentage}
                    onChange={(e) => setFormData({ ...formData, attendance_percentage: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Assignment Average
                    <span className="monospace" style={{ marginLeft: '1rem', fontWeight: 'normal' }}>
                      ({formData.assignment_average}%)
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.assignment_average}
                    onChange={(e) => setFormData({ ...formData, assignment_average: parseFloat(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                  <input
                    type="number"
                    className="form-input"
                    value={formData.assignment_average}
                    onChange={(e) => setFormData({ ...formData, assignment_average: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Study Hours Per Week
                    <span className="monospace" style={{ marginLeft: '1rem', fontWeight: 'normal' }}>
                      ({formData.study_hours_per_week} hours)
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={formData.study_hours_per_week}
                    onChange={(e) => setFormData({ ...formData, study_hours_per_week: parseFloat(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                  <input
                    type="number"
                    className="form-input"
                    value={formData.study_hours_per_week}
                    onChange={(e) => setFormData({ ...formData, study_hours_per_week: parseFloat(e.target.value) })}
                    min="0"
                    max="40"
                    step="0.5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Socioeconomic Status</label>
                  <select
                    className="form-select"
                    value={formData.socioeconomic_status}
                    onChange={(e) => setFormData({ ...formData, socioeconomic_status: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.extracurricular_participation}
                      onChange={(e) => setFormData({ ...formData, extracurricular_participation: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span className="form-label" style={{ margin: 0 }}>
                      Extracurricular Participation
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--cream)', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Prediction Weight Distribution</h3>
                <ul style={{ marginLeft: '1.5rem' }}>
                  <li>First Semester GPA: <strong>40%</strong></li>
                  <li>Attendance: <strong>15%</strong></li>
                  <li>Assignment Average: <strong>15%</strong></li>
                  <li>Study Hours: <strong>10%</strong></li>
                  <li>Admission Score: <strong>10%</strong></li>
                  <li>Socioeconomic Status: <strong>10%</strong></li>
                </ul>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Factors'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Factors;

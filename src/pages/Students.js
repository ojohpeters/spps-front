import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    admission_year: new Date().getFullYear(),
    admission_score: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.create(formData);
      setShowForm(false);
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        admission_year: new Date().getFullYear(),
        admission_score: '',
      });
      loadStudents();
    } catch (error) {
      alert('Failed to create student: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="card-title">Student Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Manage student records and academic information
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Add New Student</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Admission Year</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.admission_year}
                  onChange={(e) => setFormData({ ...formData, admission_year: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Admission Score (JAMB)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.admission_score}
                  onChange={(e) => setFormData({ ...formData, admission_score: e.target.value })}
                  required
                  min="100"
                  max="400"
                />
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                Create Student
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Students ({students.length})</h2>
        </div>
        {students.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No students found. Add your first student to get started.
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Admission Year</th>
                  <th>Current GPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="monospace">{student.student_id}</td>
                    <td>{student.first_name} {student.last_name}</td>
                    <td>{student.department}</td>
                    <td>{student.email}</td>
                    <td className="monospace">{student.admission_year}</td>
                    <td className="monospace">{student.current_gpa?.toFixed(2) || 'N/A'}</td>
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

export default Students;

import React, { useState } from 'react';
import { studentAPI } from '../services/api';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState('First');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const response = await studentAPI.uploadCSV(file, semester);
      setResult(response.data);
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      setResult({
        success: false,
        error: error.response?.data?.error || 'Upload failed'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'student_id,course_code,course_title,score,credit_units\nSTU001,CSC101,Introduction to Computing,75,3\nSTU001,MTH101,Calculus I,82,3\nSTU002,CSC101,Introduction to Computing,68,3';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_results_template.csv';
    a.click();
  };

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '2rem' }}>
        <h1 className="card-title">Upload Student Results</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Import student academic results via CSV file
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">CSV Upload Instructions</h2>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Your CSV file must contain the following columns:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li><strong className="monospace">student_id</strong> - Student identification number</li>
            <li><strong className="monospace">course_code</strong> - Course code (e.g., CSC101)</li>
            <li><strong className="monospace">course_title</strong> - Course name (optional)</li>
            <li><strong className="monospace">score</strong> - Student's score (0-100)</li>
            <li><strong className="monospace">credit_units</strong> - Course credit units</li>
          </ul>
          <button 
            className="btn btn-secondary" 
            onClick={downloadTemplate}
            style={{ marginTop: '1rem' }}
          >
            Download CSV Template
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Upload File</h2>
        </div>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label">Semester</label>
            <select
              className="form-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
              <option value="Third">Third Semester</option>
              <option value="Fourth">Fourth Semester</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">CSV File</label>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Results'}
          </button>
        </form>

        {result && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: result.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px'
          }}>
            {result.success ? (
              <>
                <h3 style={{ color: '#155724', marginBottom: '1rem' }}>✓ Upload Successful</h3>
                <p><strong>Results Created:</strong> {result.results_created}</p>
                <p><strong>Total Processed:</strong> {result.total_processed}</p>
                {result.errors && result.errors.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Warnings:</strong>
                    <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                      {result.errors.map((err, idx) => (
                        <li key={idx} style={{ fontSize: '0.9rem' }}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 style={{ color: '#721c24', marginBottom: '1rem' }}>✗ Upload Failed</h3>
                <p>{result.error}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCSV;

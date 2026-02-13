import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import UploadCSV from './pages/UploadCSV';
import Factors from './pages/Factors';
import Predictions from './pages/Predictions';
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Header user={user} setUser={setUser} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/students" 
              element={user ? <Students /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/upload" 
              element={user ? <UploadCSV /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/factors" 
              element={user ? <Factors /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/predictions" 
              element={user ? <Predictions /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

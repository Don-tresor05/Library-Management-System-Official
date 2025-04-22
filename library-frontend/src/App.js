// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookList from './pages/BookList';
import UserManagement from './pages/UserManagement';
import LoanManagement from './pages/LoanManagement';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/loans" element={<LoanManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
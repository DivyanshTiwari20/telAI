import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Title Bar */}
        <div className="title-bar">
          <h1>.Swasthya</h1>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
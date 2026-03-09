import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AssignmentList from './components/AssignmentList';
import Workspace from './components/Workspace';
import './styles/main.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<Workspace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

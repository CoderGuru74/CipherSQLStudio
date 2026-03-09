import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import AssignmentList from './components/AssignmentList';
import Workspace from './components/Workspace';
import Progress from './components/Progress';
import ToastNotification from './components/ToastNotification';
import './styles/main.scss';

function App() {
  const { toasts } = useToast();

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<Workspace />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
        
        {/* Toast Container */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <ToastNotification
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => {/* Handled by useToast hook */}}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;

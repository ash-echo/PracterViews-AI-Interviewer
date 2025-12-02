import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interview/:type" element={<InterviewRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccidentList from './components/AccidentList';
import MapPage from './pages/MapPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AccidentList />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

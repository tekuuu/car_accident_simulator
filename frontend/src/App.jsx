// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccidentList from './components/AccidentList';
import MapPage from './pages/MapPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="w-full h-screen">
        <Routes>
          <Route path="/" element={<AccidentList />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import Enroll from './pages/Enroll';
import Verify from './pages/Verify';
import Identify from './pages/Identify';
import { Link, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow p-4 flex justify-center space-x-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">Enroll</Link>
        <Link to="/verify" className="text-blue-600 hover:text-blue-800 font-medium">Verify</Link>
        <Link to="/identify" className="text-blue-600 hover:text-blue-800 font-medium">Identify</Link>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Enroll />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/identify" element={<Identify />} />
        </Routes>
      </main>


    </div>
  );
}

export default App;

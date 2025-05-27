import Enroll from './pages/Enroll';
import Verify from './pages/Verify';
import Identify from './pages/Identify';
import { NavLink, Route, Routes } from 'react-router-dom';
import logo from './assets/ivt.png';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* <nav className="bg-white shadow p-4 flex justify-center justify-between"> */}
      <nav className="bg-white shadow p-4 flex justify-between border-b-4 border-yellow-500">

        {/* <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">Enroll</Link>
        <Link to="/verify" className="text-blue-600 hover:text-blue-800 font-medium">Verify</Link>
        <Link to="/identify" className="text-blue-600 hover:text-blue-800 font-medium">Identify</Link> */}

        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-28" />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'bg-blue-600 text-white px-4 py-2 rounded'
                : 'text-blue-600 hover:text-blue-800 px-4 py-2 rounded hover:bg-blue-100'
            }
          >
            Enrollment
          </NavLink>

          <NavLink
            to="/verify"
            className={({ isActive }) =>
              isActive
                ? 'bg-green-600 text-white px-4 py-2 rounded'
                : 'text-green-600 hover:text-green-800 px-4 py-2 rounded hover:bg-green-100'
            }
          >
            Verification
          </NavLink>

          <NavLink
            to="/identify"
            className={({ isActive }) =>
              isActive
                ? 'bg-orange-600 text-white px-4 py-2 rounded'
                : 'text-orange-600 hover:text-orange-800 px-4 py-2 rounded hover:bg-orange-100'
            }
          >
            Identification
          </NavLink>
        </div>
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

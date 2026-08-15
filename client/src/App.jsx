import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportItem from './pages/ReportItem';
import ItemDetail from './pages/ItemDetail';
import MyActivity from './pages/MyActivity';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route
            path="/report/lost"
            element={<ProtectedRoute><ReportItem mode="lost" /></ProtectedRoute>}
          />
          <Route
            path="/report/found"
            element={<ProtectedRoute><ReportItem mode="found" /></ProtectedRoute>}
          />
          <Route path="/me" element={<ProtectedRoute><MyActivity /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route
            path="/admin/listings"
            element={<AdminRoute><AdminListings /></AdminRoute>}
          />
        </Routes>
      </main>
    </>
  );
}

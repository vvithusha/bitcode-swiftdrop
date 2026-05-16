import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import PurchaseConfirm from './pages/PurchaseConfirm';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventNew from './pages/admin/AdminEventNew';
import AdminEventEdit from './pages/admin/AdminEventEdit';
import AdminUsers from './pages/admin/AdminUsers';

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      <p className="text-slate-400">Page coming next.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/purchase/:orderId" element={<PurchaseConfirm />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/admin/events/new" element={<AdminEventNew />} />
      <Route path="/admin/events/:id/edit" element={<AdminEventEdit />} />
      <Route path="/admin/users" element={<AdminUsers />} />

      <Route path="*" element={<Placeholder title="Not Found" />} />
    </Routes>
  );
}

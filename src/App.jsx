import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProfileEditor from './components/ProfileEditor';
import PublicProfile from './components/PublicProfile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/profiles" replace />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/profiles" element={<Dashboard />} />
      <Route path="/admin/profiles/new" element={<ProfileEditor />} />
      <Route path="/admin/profiles/:id" element={<ProfileEditor />} />
      <Route path="/p/:slug" element={<PublicProfile />} />
      <Route path="*" element={<Navigate to="/admin/profiles" replace />} />
    </Routes>
  );
}

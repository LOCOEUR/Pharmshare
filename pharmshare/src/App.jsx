import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Market from './pages/Market';
import Requests from './pages/Requests';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SurplusDeclaration from './pages/SurplusDeclaration';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Logout from './pages/Logout';
import Balance from './pages/Balance';
import AdminDashboard from './pages/AdminDashboard';
import AdminValidations from './pages/AdminValidations';
import AdminSupport from './pages/AdminSupport';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { SearchProvider } from './context/SearchContext';

import { useEffect } from 'react';
import realtimeService from './services/RealtimeService';

const MobileBlocker = () => (
  <div className="mobile-only-blocker">
    <div className="blocker-content">
      <div className="blocker-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
      </div>
      <h1>Version Mobile en Arrivée</h1>
      <p>L'expérience complète PharmShare est optimisée pour PC et Laptop. Nous peaufinons actuellement la version mobile pour vous offrir la meilleure expérience médicale.</p>
      <div className="blocker-badge">Bientôt disponible</div>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // 🔴 PATCH AUTO-CORRECTION: Si le cache contient le nom Super Administrateur mais que le rôle est vide ou incorrect, on force la reco
    const user = JSON.parse(localStorage.getItem('pharmshare_user') || 'null');
    if (user && user.nom === 'Super Administrateur' && user.role !== 'super_admin') {
      localStorage.removeItem('pharmshare_user');
      localStorage.removeItem('pharmshare_token');
      window.location.href = '/login';
      return;
    }

    realtimeService.start();

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => realtimeService.stop();
  }, []);

  return (
    <BrowserRouter>
      <SearchProvider>
        <MobileBlocker />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          {/* Pages protégées avec Layout partagé */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Layout><Market /></Layout></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Layout><Requests /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path="/surplus-declaration" element={<ProtectedRoute><Layout><SurplusDeclaration /></Layout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
          <Route path="/balance" element={<ProtectedRoute><Layout><Balance /></Layout></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Layout><Help /></Layout></ProtectedRoute>} />

          {/* Routes Admin Global - Layout dédié */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/pharmacies" element={<ProtectedRoute><AdminLayout><AdminValidations /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute><AdminLayout><AdminSupport /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/produits" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/database" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;

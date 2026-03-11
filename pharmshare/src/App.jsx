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
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { SearchProvider } from './context/SearchContext';

import { useEffect } from 'react';
import realtimeService from './services/RealtimeService';

function App() {
  useEffect(() => {
    // Démarrer le service temps réel au chargement
    // Il se connectera uniquement si un token est présent
    realtimeService.start();

    // Demander la permission pour les notifications de bureau
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => realtimeService.stop();
  }, []);

  return (
    <BrowserRouter>
      <SearchProvider>
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
          <Route path="/help" element={<ProtectedRoute><Layout><Help /></Layout></ProtectedRoute>} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;

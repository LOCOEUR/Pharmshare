import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Lire le rôle depuis localStorage
    const user = JSON.parse(localStorage.getItem('pharmshare_user') || 'null');
    const role = user?.role;

    // PATCH ANTI-CACHE : Si on s'appelle Super Administrateur mais que le rôle n'est pas bon, on force la déconnexion nette
    if (user && user.nom === 'Super Administrateur' && role !== 'super_admin') {
        localStorage.clear();
        window.location.href = '/login';
        return null;
    }

    // Le super_admin est redirigé vers /admin s'il tente d'aller sur une route normale
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (role === 'super_admin' && !isAdminRoute) {
        return <Navigate to="/admin" replace />;
    }

    // Un utilisateur normal ne peut pas accéder aux routes /admin
    if (role !== 'super_admin' && isAdminRoute) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;


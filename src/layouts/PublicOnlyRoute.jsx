import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading SmartPet...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import PublicOnlyRoute from './layouts/PublicOnlyRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyPets from './pages/MyPets';
import PetForm from './pages/PetForm';
import Vaccinations from './pages/Vaccinations';
import MedicalHistory from './pages/MedicalHistory';
import VetVisits from './pages/VetVisits';
import Reminders from './pages/Reminders';
import Emergency from './pages/Emergency';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <MyPets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/add"
            element={
              <ProtectedRoute>
                <PetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/edit/:id"
            element={
              <ProtectedRoute>
                <PetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vaccinations"
            element={
              <ProtectedRoute>
                <Vaccinations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-history"
            element={
              <ProtectedRoute>
                <MedicalHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vet-visits"
            element={
              <ProtectedRoute>
                <VetVisits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <Emergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

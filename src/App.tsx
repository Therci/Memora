import React, { memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FeedPage } from './pages/FeedPage';
import { CreateMemoryPage } from './pages/CreateMemoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { MemoryDetailPage } from './pages/MemoryDetailPage';
function PrivateRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-mono text-gray-600">Carregando...</p>
      </div>;
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
}
function PublicRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-mono text-gray-600">Carregando...</p>
      </div>;
  }
  return user ? <Navigate to="/feed" /> : <>{children}</>;
}
export function App() {
  return <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/login" element={<PublicRoute>
                <LoginPage />
              </PublicRoute>} />
          <Route path="/register" element={<PublicRoute>
                <RegisterPage />
              </PublicRoute>} />
          <Route path="/feed" element={<PrivateRoute>
                <FeedPage />
              </PrivateRoute>} />
          <Route path="/create-memory" element={<PrivateRoute>
                <CreateMemoryPage />
              </PrivateRoute>} />
          <Route path="/memory/:id" element={<PrivateRoute>
                <MemoryDetailPage />
              </PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute>
                <SettingsPage />
              </PrivateRoute>} />
          <Route path="/profile/:userId" element={<PrivateRoute>
                <ProfilePage />
              </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ToastProvider>;
}
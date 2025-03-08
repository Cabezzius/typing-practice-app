import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { TypingProvider } from './contexts/TypingContext';

// Componentes
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TypingPage from './pages/TypingPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TextsPage from './pages/TextsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TypingProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/typing" element={<TypingPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                
                {/* Rutas protegidas */}
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/stats" 
                  element={
                    <PrivateRoute>
                      <StatsPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/texts" 
                  element={
                    <PrivateRoute>
                      <TextsPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Página 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </TypingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
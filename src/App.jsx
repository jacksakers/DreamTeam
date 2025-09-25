import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HouseholdProvider } from './context/HouseholdContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import JoinPage from './pages/JoinPage';
import ProtectedRoute from './components/ProtectedRoute';
import ShoppingListPage from './features/shopping/ShoppingListPage';
import CalendarPage from './features/calendar/CalendarPage';

function App() {
  return (
    <AuthProvider>
      <HouseholdProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/join/:householdId" element={<JoinPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopping-lists"
                element={
                  <ProtectedRoute>
                    <ShoppingListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              {/* Add other protected routes here */}
            </Routes>
          </Layout>
        </BrowserRouter>
      </HouseholdProvider>
    </AuthProvider>
  )
}

export default App

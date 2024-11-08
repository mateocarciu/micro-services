import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import HomePage from './pages/Dashboard';
import Profile from './pages/Profile';
import CustomerOrderPage from './pages/Order';
import KitchenMenuPage from './pages/Kitchen';
import DeliveryDashboard from './pages/Delivery';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<HomePage />} />
              <Route path="order" element={<CustomerOrderPage />} />
              <Route path="kitchen" element={<KitchenMenuPage />} />
              <Route path="delivery" element={<DeliveryDashboard />} />
              <Route path="login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="dashboard" element={<HomePage />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
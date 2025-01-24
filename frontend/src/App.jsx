import { Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MeetingsPage from "./pages/MeetingsPage";
import ProfilePage from "./pages/ProfilePage";
import CalculatorPage from "./pages/CalculatorPage";
import ProductsPage from "./pages/ProductsPage";
import TestimonialPage from "./pages/TestimonialPage";
import EventPage from "./pages/EventPage";
import NavigationBar from "./components/NavigationBar";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, loggedInUserId }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!loggedInUserId) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <NavigationBar loggedInUserId={loggedInUserId} />
      {children}
    </>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  loggedInUserId: PropTypes.string,
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

RedirectAuthenticatedUser.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const { isCheckingAuth, isAuthenticated, checkAuth, user } = useAuthStore();
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        if (!loggedInUserId && isAuthenticated) {
          const { data } = await axios.get("http://localhost:5000/api/auth/me");
          console.log("Fetched logged-in user ID:", data.userId);
          setLoggedInUserId(data.userId);
        }
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error);
        setLoggedInUserId(null);
      }
    };

    checkAuth(); // Update authentication state
    fetchLoggedInUserId(); // Fetch user ID only if authenticated
  }, [checkAuth, isAuthenticated, loggedInUserId]);

  useEffect(() => {
    console.log("App State - isCheckingAuth:", isCheckingAuth);
    console.log("App State - isAuthenticated:", isAuthenticated);
    console.log("App State - loggedInUserId:", loggedInUserId);
  }, [isCheckingAuth, isAuthenticated, loggedInUserId]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <MeetingsPage isAdmin={user?.role === "admin"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <CalculatorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <ProductsPage isAdmin={user?.role === "admin"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/testimonials"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <TestimonialPage isAdmin={user?.role === "admin"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <EventPage isAdmin={user?.role === "admin"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:userId"
          element={
            <ProtectedRoute loggedInUserId={loggedInUserId}>
              <ProfilePage loggedInUserId={loggedInUserId} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;

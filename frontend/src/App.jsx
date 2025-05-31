import { Route, Routes, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TravelPlanPage from "./pages/TravelPlanPage";
import { useColorModeValue } from "@chakra-ui/react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (check for token in localStorage)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <LoginPage onLogin={handleLogin} /> : 
            <Navigate to="/travel-plans" replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <RegisterPage /> : 
            <Navigate to="/travel-plans" replace />
          } 
        />
        <Route 
          path="/travel-plans" 
          element={
            isAuthenticated ? 
            <TravelPlanPage user={user} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/travel-plans" : "/login"} replace />
          } 
        />
      </Routes>
    </Box>
  );
}

export default App;

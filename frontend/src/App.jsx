import { Route, Routes, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import ExplorePage from "./pages/ExplorePage";
import PreferencesPage from "./pages/PreferencesPage";
import { useColorModeValue } from "@chakra-ui/react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);

  useEffect(() => {
    // Kiểm tra token và user trong localStorage khi app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsAuthenticated(true);
      setUser(parsedUser);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    
    // Logic routing dựa trên hasPreferences
    if (!userData.hasPreferences) {
      // User chưa có preferences, chuyển đến preferences page
      window.location.href = '/preferences';
    } else {
      // User đã có preferences, chuyển đến chat page
      window.location.href = '/chat';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={handleLogout} 
        onToggleItinerary={() => setShowItinerary(v => !v)}
      />

      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? <LoginPage onLogin={handleLogin} /> : (
            !user?.hasPreferences ? <Navigate to="/preferences" replace /> : <Navigate to="/chat" replace />
          )
        } />
        <Route path="/signup" element={
          !isAuthenticated ? <SignupPage onLogin={handleLogin} /> : (
            !user?.hasPreferences ? <Navigate to="/preferences" replace /> : <Navigate to="/chat" replace />
          )
        } />
        <Route path="/preferences" element={
          isAuthenticated ? <PreferencesPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/chat" element={
          isAuthenticated
            ? (user?.hasPreferences ? <ChatPage user={user} showItinerary={showItinerary} onCloseItinerary={() => setShowItinerary(false)} /> : <Navigate to="/preferences" replace />)
            : <Navigate to="/login" replace />
        } />
        <Route path="/explore" element={
          isAuthenticated
            ? (user?.hasPreferences ? <ExplorePage user={user} /> : <Navigate to="/preferences" replace />)
            : <Navigate to="/login" replace />
        } />
        <Route path="/create" element={
          isAuthenticated
            ? (user?.hasPreferences ? <CreatePage /> : <Navigate to="/preferences" replace />)
            : <Navigate to="/login" replace />
        } />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Box>
  );
}

export default App;

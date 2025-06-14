// import { Route, Routes, Navigate } from "react-router-dom";
// import { Box } from "@chakra-ui/react";
// import { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import ChatPage from "./pages/ChatPage";
// import ExplorePage from "./pages/ExplorePage";
// import { useColorModeValue } from "@chakra-ui/react";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if user is logged in (check for token in localStorage)
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   const handleLogin = (token, userData) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsAuthenticated(true);
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return (
//     <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
//       <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
//       <Routes>
//         <Route 
//           path="/login" 
//           element={
//             !isAuthenticated ? 
//             <LoginPage onLogin={handleLogin} /> : 
//             <Navigate to="/chat" replace />
//           } 
//         />
//         <Route 
//           path="/signup" 
//           element={
//             !isAuthenticated ? 
//             <SignupPage /> : 
//             <Navigate to="/chat" replace />
//           } 
//         />
//         <Route 
//           path="/chat" 
//           element={
//             isAuthenticated ? 
//             <ChatPage user={user} /> : 
//             <Navigate to="/login" replace />
//           } 
//         />
//         <Route 
//           path="/" 
//           element={
//             // <Navigate to={isAuthenticated ? "/chat" : "/"} replace />
//             <HomePage />
//           } 
//         />
//         <Route 
//           path="/explore" 
//           element={
//             isAuthenticated ? 
//             <ExplorePage user={user} /> : 
//             <Navigate to="/login" replace />
//           }
//         />
//       </Routes>
//     </Box>
//   );
// }

// export default App;

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
import { useColorModeValue } from "@chakra-ui/react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra token và user trong localStorage khi app load
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
      {/* Giữ nguyên Navbar
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /> */}

      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <LoginPage onLogin={handleLogin} /> : 
            <Navigate to="/chat" replace />
          } 
        />
        <Route 
          path="/signup" 
          element={
            !isAuthenticated ? 
            <SignupPage /> : 
            <Navigate to="/chat" replace />
          } 
        />
        <Route 
          path="/chat" 
          element={
            isAuthenticated ? 
            <ChatPage user={user} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/explore" 
          element={
            isAuthenticated ? 
            <ExplorePage user={user} /> : 
            <Navigate to="/login" replace />
          }
        />
        <Route 
          path="/create"
          element={
            isAuthenticated ? 
            <CreatePage /> : 
            <Navigate to="/login" replace />
          }
        />
        <Route 
          path="/" 
          element={<HomePage />}
        />
        <Route 
          path="/chat1" 
          element={<ChatPage />}
        />
        <Route 
          path="/explore1" 
          element={<ExplorePage />}
        />
      </Routes>
    </Box>
  );
}

export default App;

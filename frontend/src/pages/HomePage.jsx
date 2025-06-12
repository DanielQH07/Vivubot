// HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';  // import useNavigate
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate(); // khởi tạo hàm điều hướng

  const placeholderImage = 'background.png';

  const styles = {
    container: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
    },
    left: {
      flex: 1,
      backgroundImage: `url(${placeholderImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    right: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(90deg, #004E5A 0%, #001A1F 100%)',
      color: '#fff',
      position: 'relative',
    },
    brandName: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginRight: '16px',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
    },
    navbar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      backgroundColor: 'rgba(217, 217, 217, 0.6)',
    },
    logo: {
      flexShrink: 0, // giữ nguyên logo, không co lại
    },
    sloganContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center', // căn giữa ngang
      alignItems: 'center',     // căn giữa dọc
    },
    
    slogan: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'black',
    },
    buttonPrimary: {
      width: '480px',
      padding: '15px 0',
      backgroundColor: 'teal',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '50px',
      cursor: 'pointer',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    orText: {
      margin: '20px 20px',
      color: '#fff',
      fontSize: '40px',
      opacity: 0.9,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.left} />
      <div style={styles.right}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <div style={{ ...styles.logo, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" style={{ width: '150px' }} />
          </div>
          <div style={{ ...styles.sloganContainer, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={styles.slogan}>AI Assistant for Vietnam Traveling</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <button
            style={styles.buttonPrimary}
            onClick={() => navigate('/signup')}  // chuyển đến /signup khi click
          >
            Sign Up
          </button>
          <span style={styles.orText}>Or</span>
          <button
            style={styles.buttonPrimary}
            onClick={() => navigate('/login')}  // chuyển đến /login khi click
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
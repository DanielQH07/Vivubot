// HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';  // import useNavigate
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate(); // khởi tạo hàm điều hướng

  const placeholderImage = 'https://png.pngtree.com/png-clipart/20240905/original/pngtree-stack-of-plain-pancakes-png-image_15935323.png';

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
      background: 'linear-gradient(90deg, #C4C4C4 30%, #003D5B 100%)',
      color: '#fff',
      position: 'relative',
    },
    logo: {
      fontSize: '32px',
      marginRight: '8px',
    },
    brandName: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginRight: '16px',
    },
    slogan: {
      fontSize: '40px',
      fontWeight: 'bold',
      marginLeft: 'auto',
      marginRight: '20px',
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
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'rgba(0, 61, 91, 0.8)',
    },
    buttonPrimary: {
      width: '480px',
      padding: '15px 0',
      backgroundColor: '#2AB7CA',
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
          <div style={styles.logo}>🤖</div>
          <div style={styles.brandName}>VIVUBOT</div>
          <div style={styles.slogan}>AI Assistant for Vietnam Traveling</div>
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

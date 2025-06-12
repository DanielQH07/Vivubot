import React, { useState } from 'react';
import {
  Flex, Box, VStack, Heading, Input, Button, Text, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [loading, setLoading]         = useState(false);
  const toast    = useToast();
  const navigate = useNavigate();

  const placeholderImage = 'background.png';

  // styles navbar giống HomePage
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
    navbar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      backgroundColor: 'rgba(217, 217, 217, 0.6)',
    },
    logo: {
      flexShrink: 0,
    },
    sloganContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    slogan: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'black',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 40px',
    },
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Password và Confirm Password không khớp',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      toast({ title: 'Đăng ký thành công', description: data.message, status: 'success', duration: 3000, isClosable: true });
      navigate('/login');
    } catch (err) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 4000, isClosable: true });
    } finally {
      setLoading(false);
    }
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

        {/* Main Signup Form */}
        <div style={styles.mainContent}>
          <Heading mb={10} color="white">Sign Up</Heading>
          <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Username"
                bg="white" color="black"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                bg="white" color="black"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                bg="white" color="black"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                bg="white" color="black"
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
              />
              <Button colorScheme="teal" isLoading={loading} type="submit">
                Sign Up
              </Button>
              <Text>
                Đã có tài khoản?{' '}
                <Text as="span" color="teal.200" cursor="pointer" onClick={() => navigate('/login')}>
                  Login
                </Text>
              </Text>
            </VStack>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

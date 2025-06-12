import React, { useState } from 'react';
import {
  Flex, Box, VStack, Heading, Input, Button, Text, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const toast    = useToast();
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
    },
    left: {
      flex: 1,
      backgroundImage: `url('background.png')`,
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
      padding: '0 50px',
    },
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      onLogin(data.token, data.user);
      toast({ title: 'Đăng nhập thành công', status: 'success', duration: 3000, isClosable: true });
      navigate('/chat');
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
        {/* Navbar giống HomePage */}
        <div style={styles.navbar}>
          <div style={{ ...styles.logo, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" style={{ width: '150px' }} />
          </div>
          <div style={{ ...styles.sloganContainer, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={styles.slogan}>AI Assistant for Vietnam Traveling</div>
          </div>
        </div>

        {/* Form Login */}
        <div style={styles.mainContent}>
        <Box flex={1} p={10}>
          <Heading mb={10}>Login</Heading>
          <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <VStack spacing={4} align="stretch">
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
              <Button colorScheme="teal" isLoading={loading} type="submit">
                Login
              </Button>
              <Text>
                Chưa có tài khoản?{' '}
                <Text as="span" color="teal.200" cursor="pointer" onClick={() => navigate('/signup')}>
                  Sign up
                </Text>
              </Text>
            </VStack>
          </form>
        </Box>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

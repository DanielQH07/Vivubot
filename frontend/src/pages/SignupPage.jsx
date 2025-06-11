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

  // styles navbar giống HomePage
  const styles = {
    navbar: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'rgba(0, 61, 91, 0.8)',
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
    <Flex w="100vw" h="100vh">
      <Box flex={1}
        bgImage="url('https://png.pngtree.com/png-clipart/20240905/original/pngtree-stack-of-plain-pancakes-png-image_15935323.png')"
        bgSize="cover"
      />

      <Flex flex={1} direction="column" bgGradient="linear(to-r, #003D5B, #002A3A)" color="white">

        {/* Navbar */}
        <Box style={styles.navbar}>
          <Box style={styles.logo}>🤖</Box>
          <Box style={styles.brandName}>VIVUBOT</Box>
          <Box style={styles.slogan}>AI Assistant for Vietnam Traveling</Box>
        </Box>

        <Box flex={1} p={10}>
          <Heading mb={10}>Sign Up</Heading>
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
            <Button colorScheme="teal" isLoading={loading} onClick={handleSubmit}>
              Sign Up
            </Button>
            <Text>
              Đã có tài khoản?{' '}
              <Text as="span" color="teal.200" cursor="pointer" onClick={() => navigate('/login')}>
                Login
              </Text>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignupPage;

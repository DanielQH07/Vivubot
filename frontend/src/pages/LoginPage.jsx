import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.user);
        navigate('/travel-plans');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        p={8}
        rounded="lg"
        shadow="md"
      >
        <VStack spacing={6}>
          <Heading size="lg" textAlign="center">
            Login to VivuBot
          </Heading>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={isLoading}
                loadingText="Logging in..."
              >
                Login
              </Button>
            </VStack>
          </form>

          <Text textAlign="center">
            Don't have an account?{' '}
            <ChakraLink as={Link} to="/register" color="teal.500">
              Register here
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default LoginPage; 
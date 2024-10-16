import React, { useEffect, useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  Text,
  Box,
} from '@chakra-ui/react';
import Swal from 'sweetalert2'; // Import SweetAlert

const Login = ({ onLogin }) => {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(50, 50, 50, 0.9)');
  const backgroundImage = "url('https://example.com/your-background-image.jpg')";
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Check if both fields are empty
    if (!username && !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Required',
        text: 'Please fill in both username and password.',
        confirmButtonText: 'Okay'
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Simpan data pengguna di localStorage
        localStorage.setItem('user', JSON.stringify(data));
  
        // Panggil fungsi untuk memperbarui status login
        onLogin(username);
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
  
        // Handle specific error messages
        if (errorData.error.includes('username')) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Username',
            text: 'The username you entered is incorrect.',
            confirmButtonText: 'Try Again'
          });
        } else if (errorData.error.includes('password')) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'The password you entered is incorrect.',
            confirmButtonText: 'Try Again'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid username or password.',
            confirmButtonText: 'Try Again'
          });
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
  
      // Display SweetAlert for general errors
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
        confirmButtonText: 'Okay'
      });
    }
  };
  
  // Cek status login saat komponen pertama kali dimuat
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      onLogin(userData.username); // Set status login jika user ditemukan
    }
  }, []);
  

  return (
    <Flex
      h="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundImage={backgroundImage}
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
    >
      <Box
        bg={formBackground}
        p={12}
        borderRadius={8}
        boxShadow="lg"
        width={{ base: "90%", md: "400px" }}
        position="relative"
        zIndex={1}
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Welcome Back!
        </Heading>
        <Text textAlign="center" mb={8} color="gray.600">
          Please log in to your account to continue
        </Text>
        <form onSubmit={handleLogin}>
          <FormControl mb={4}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="yourusername"
              type="text"
              variant="filled"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              placeholder="**********"
              type="password"
              variant="filled"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" mb={6} type="submit" width="full">
            Log In
          </Button>
        </form>
        <FormControl display="flex" alignItems="center" justifyContent="center">
          <FormLabel htmlFor="dark_mode" mb="0">
            Enable Dark Mode?
          </FormLabel>
          <Switch
            id="dark_mode"
            colorScheme="teal"
            size="lg"
            onChange={toggleColorMode}
          />
        </FormControl>
      </Box>

      <Box
        position="absolute"
        bottom={4}
        left={0}
        right={0}
        textAlign="center"
        color="white"
        opacity={0.5}
        fontSize="sm"
        zIndex={0}
      >
        Powered by NusaTekno
      </Box>
    </Flex>
  );
};

export default Login;

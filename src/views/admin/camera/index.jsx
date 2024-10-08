import React, { useEffect, useState } from 'react';
import { Box, Text, Button, VStack, Spinner } from '@chakra-ui/react';

const CameraTrackingComponent = () => {
  const [cameraData, setCameraData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mendapatkan data pelacakan kamera
  const fetchCameraData = async () => {
    try {
      setLoading(true);
      // Ganti dengan endpoint API Anda untuk mendapatkan data pelacakan kamera
      const response = await fetch('https://api.example.com/camera-data');
      const data = await response.json();
      setCameraData(data);
    } catch (error) {
      console.error('Error fetching camera data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraData(); // Panggil fungsi untuk mendapatkan data saat komponen pertama kali dimuat
  }, []);

  return (
    <Box p={5}>
      {loading ? (
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading camera data...</Text>
        </VStack>
      ) : cameraData.length > 0 ? (
        <Box>
          <Text fontSize="2xl" mb={4}>Camera Tracking</Text>
          {cameraData.map((camera, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
              <Text fontWeight="bold">Camera ID: {camera.id}</Text>
              <Text>Location: {camera.location}</Text>
              <Text>Status: {camera.status}</Text>
              <Button colorScheme="blue" onClick={() => alert(`Viewing camera ${camera.id}`)}>
                View Feed
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Text>No camera data available.</Text>
      )}
    </Box>
  );
};

export default CameraTrackingComponent;

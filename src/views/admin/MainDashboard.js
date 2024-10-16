import React from 'react';
import { Box, Heading, Text, SimpleGrid, Card, CardBody, Stack, Button, Icon } from '@chakra-ui/react';
import { MdMyLocation, MdPhotoCamera, MdWarning, MdPeople, MdAssessment, MdHistory } from 'react-icons/md';

const MainDashboard = () => {
  return (
    <Box padding="20px" bg="gray.50" minHeight="100vh">
      <Heading as="h2" size="lg" mb={6} textAlign="center">Dashboard Utama</Heading>
      <Text fontSize="lg" mb={8} textAlign="center">Selamat datang di Dashboard Pelacakan Utama. Pilih menu di samping untuk mengakses fitur pelacakan GPS, Kamera, Deteksi Kerusakan, Driver, Laporan, atau Riwayat Armada.</Text>

      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        <Card>
          <CardBody>
            <Stack spacing={3} align="center">
              <Icon as={MdMyLocation} boxSize={10} color="blue.500" />
              <Text fontWeight="bold">Pelacakan GPS</Text>
              <Text>Monitor kendaraan Anda secara real-time.</Text>
              <Button colorScheme="blue" variant="outline">Lihat Detail</Button>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stack spacing={3} align="center">
              <Icon as={MdPhotoCamera} boxSize={10} color="green.500" />
              <Text fontWeight="bold">Kamera Lacak</Text>
              <Text>Live feed dari kamera pemantauan.</Text>
              <Button colorScheme="green" variant="outline">Lihat Detail</Button>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stack spacing={3} align="center">
              <Icon as={MdWarning} boxSize={10} color="red.500" />
              <Text fontWeight="bold">Deteksi Kerusakan</Text>
              <Text>Identifikasi kerusakan dengan cepat.</Text>
              <Button colorScheme="red" variant="outline">Lihat Detail</Button>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stack spacing={3} align="center">
              <Icon as={MdPeople} boxSize={10} color="purple.500" />
              <Text fontWeight="bold">Driver</Text>
              <Text>Kelola dan pantau informasi driver.</Text>
              <Button colorScheme="purple" variant="outline">Lihat Detail</Button>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stack spacing={3} align="center">
              <Icon as={MdAssessment} boxSize={10} color="teal.500" />
              <Text fontWeight="bold">Laporan</Text>
              <Text>Buat dan lihat laporan armada.</Text>
              <Button colorScheme="teal" variant="outline">Lihat Detail</Button>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stack spacing={3} align="center">
              <Icon as={MdHistory} boxSize={10} color="orange.500" />
              <Text fontWeight="bold">Riwayat Armada</Text>
              <Text>Telusuri riwayat penggunaan armada.</Text>
              <Button colorScheme="orange" variant="outline">Lihat Detail</Button>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default MainDashboard;

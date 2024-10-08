import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  IconButton,
  HStack,
  VStack,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md'; // Use MdVisibility for viewing documents
import axios from 'axios';

const DriverDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('active');
  const [editingId, setEditingId] = useState(null);
  const [simFile, setSimFile] = useState(null);
  const [vehicleDataFile, setVehicleDataFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: 'Error fetching drivers',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'sim') {
      setSimFile(file);
    } else if (type === 'vehicle_data') {
      setVehicleDataFile(file);
    }
  };

  const addOrUpdateDriver = async () => {
    if (!name) {
      toast({
        title: 'Input Error',
        description: 'Name is required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('vehicle_number', vehicleNumber);
    formData.append('phone', phone);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('status', status);

    if (simFile) {
      formData.append('sim', simFile);
    }

    if (vehicleDataFile) {
      formData.append('vehicle_data', vehicleDataFile);
    }

    // Log FormData before sending
    const formDataObj = {};
    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value instanceof File ? value.name : value;
    }
    console.log('Form Data before sending:', formDataObj); // Log FormData

    try {
      if (editingId) {
        // Update existing driver
        await axios.put(`http://localhost:5000/api/drivers/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({
          title: 'Driver Updated',
          description: `${name} has been updated successfully!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new driver
        await axios.post('http://localhost:5000/api/drivers', formData);
        toast({
          title: 'Driver Added',
          description: `${name} has been added successfully!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      fetchDrivers(); 
      clearForm();
    } catch (error) {
      console.error('Error adding/updating driver:', error);
      toast({
        title: 'Error adding/updating driver',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteDriver = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      toast({
        title: 'Driver Deleted',
        description: 'Driver has been deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchDrivers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast({
        title: 'Error deleting driver',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearForm = () => {
    setName('');
    setVehicleNumber('');
    setPhone('');
    setLatitude('');
    setLongitude('');
    setStatus('active');
    setEditingId(null);
    setSimFile(null);
    setVehicleDataFile(null);
  };

  const openFileModal = (file) => {
    setSelectedFile(file);
    setIsOpen(true);
  };

  const closeFileModal = () => {
    setIsOpen(false);
    setSelectedFile(null);
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type;
    const isImage = fileType.startsWith('image/');
    
    // Only display image previews for images
    if (isImage) {
      return <Image src={URL.createObjectURL(selectedFile)} alt="Document" />;
    } else if (fileType === 'application/pdf') {
      return <iframe src={URL.createObjectURL(selectedFile)} style={{ width: '100%', height: '500px' }} title="PDF Document" />;
    }
    
    return <p>Unsupported file type</p>;
  };

  return (
    <Box p={5}>
      <h2>Dashboard Driver</h2>
      <VStack spacing={4} mb={4} mt={10}>
        <Input placeholder="Nama Driver" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Nomor Kendaraan" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
        <Input placeholder="Nomor Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <Input placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        
        <Select placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <Input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'sim')} />
        <Input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => handleFileChange(e, 'vehicle_data')} />
        
        <HStack>
          <Button colorScheme="teal" onClick={addOrUpdateDriver}>
            {editingId ? 'Update Driver' : 'Add Driver'}
          </Button>
          <Button variant="outline" onClick={clearForm}>Clear</Button>
        </HStack>
      </VStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nama</Th>
            <Th>Nomor Kendaraan</Th>
            <Th>Nomor Telepon</Th>
            <Th>Latitude</Th>
            <Th>Longitude</Th>
            <Th>KTP</Th> {/* New column for KTP */}
            <Th>SIM</Th> {/* New column for SIM */}
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {drivers.map((driver) => (
            <Tr key={driver.id}>
              <Td>{driver.id}</Td>
              <Td>{driver.name}</Td>
              <Td>{driver.vehicle_number}</Td>
              <Td>{driver.phone}</Td>
              <Td>{driver.latitude}</Td>
              <Td>{driver.longitude}</Td>
              <Td>
                {driver.ktp_url && (
                  <IconButton
                    icon={<MdVisibility />}
                    onClick={() => openFileModal(driver.ktp_url)} // Open modal for KTP
                    aria-label="View KTP"
                  />
                )}
              </Td>
              <Td>
                {driver.sim_url && (
                  <IconButton
                    icon={<MdVisibility />}
                    onClick={() => openFileModal(driver.sim_url)} // Open modal for SIM
                    aria-label="View SIM"
                  />
                )}
              </Td>
              <Td>
                <IconButton
                  icon={<MdEdit />}
                  onClick={() => {
                    setName(driver.name);
                    setVehicleNumber(driver.vehicle_number);
                    setPhone(driver.phone);
                    setLatitude(driver.latitude);
                    setLongitude(driver.longitude);
                    setStatus(driver.status);
                    setEditingId(driver.id);
                  }}
                  aria-label="Edit"
                />
                <IconButton
                  icon={<MdDelete />}
                  onClick={() => deleteDriver(driver.id)}
                  aria-label="Delete"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={closeFileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>File Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {renderFilePreview()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DriverDashboard;

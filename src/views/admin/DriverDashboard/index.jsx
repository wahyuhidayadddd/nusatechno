import React, { useEffect, useState } from 'react';
import {
  Box, Button, Table, Tbody, Td, Th, Thead, Tr, Input, IconButton, HStack, VStack, useToast, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Image, FormLabel,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import axios from 'axios';

const DriverDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    phone: '',
    status: 'active',
  });
  const [files, setFiles] = useState({ ktp: null, sim: null });
  const [editingId, setEditingId] = useState(null);
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
      showToast('Error fetching drivers', error.message, 'error');
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateDriver = async () => {
    if (!formData.name) {
      showToast('Input Error', 'Name is required.', 'warning');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
    if (files.ktp) formDataToSend.append('vehicle_data', files.ktp);
    if (files.sim) formDataToSend.append('sim', files.sim);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/drivers/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Driver Updated', `${formData.name} has been updated!`, 'success');
      } else {
        await axios.post('http://localhost:5000/api/drivers', formDataToSend);
        showToast('Driver Added', `${formData.name} has been added!`, 'success');
      }
      fetchDrivers();
      clearForm();
    } catch (error) {
      showToast('Error', error.response?.data?.error || error.message, 'error');
    }
  };

  const clearForm = () => {
    setFormData({ name: '', vehicleNumber: '', phone: '', status: 'active' });
    setFiles({ ktp: null, sim: null });
    setEditingId(null);
  };

  const openFileModal = (fileUrl) => {
    setSelectedFile(fileUrl);
    setIsOpen(true);
  };

  const closeFileModal = () => {
    setIsOpen(false);
    setSelectedFile(null);
  };

  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      vehicleNumber: driver.vehicle_number,
      phone: driver.phone,
      status: driver.status,
    });
    setEditingId(driver.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      showToast('Driver Deleted', 'The driver has been deleted!', 'success');
      fetchDrivers();
    } catch (error) {
      showToast('Error', error.response?.data?.error || error.message, 'error');
    }
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Dashboard Driver</h2>
      <VStack spacing={4} mb={4}>
        <Input placeholder="Nama Driver" name="name" value={formData.name} onChange={handleInputChange} />
        <Input placeholder="Nomor Kendaraan" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} />
        <Input placeholder="Nomor Telepon" name="phone" value={formData.phone} onChange={handleInputChange} />
        <Select placeholder="Status" name="status" value={formData.status} onChange={handleInputChange}>
          <option value="active">Aktif</option>
          <option value="inactive">Non-Aktif</option>
        </Select>

        {/* KTP File Input */}
        <Box width="100%">
          <FormLabel htmlFor="vehicleDataFile">Upload KTP (ID Card)</FormLabel>
          <Input 
            id="vehicleDataFile" 
            type="file" 
            onChange={(e) => handleFileChange(e, 'vehicle_data')} 
            accept=".jpg,.jpeg,.png,.pdf"
          />
        </Box>

        {/* SIM File Input */}
        <Box width="100%">
          <FormLabel htmlFor="simFile">Upload SIM (Driving License)</FormLabel>
          <Input 
            id="simFile" 
            type="file" 
            onChange={(e) => handleFileChange(e, 'sim')} 
            accept=".jpg,.jpeg,.png,.pdf"
          />
        </Box>
        <Button onClick={addOrUpdateDriver} colorScheme="blue" width="full">
          {editingId ? 'Update Driver' : 'Tambah Driver'}
        </Button>
      </VStack>

      <Table variant="striped" colorScheme="teal" size="md" mt={5}>
        <Thead>
          <Tr>
            <Th>Nama</Th>
            <Th>Nomor Kendaraan</Th>
            <Th>Nomor Telepon</Th>
            <Th>Status</Th>
            {/* <Th>KTP</Th> */}
            <Th>SIM</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {drivers.map((driver) => (
            <Tr key={driver.id}>
              <Td>{driver.name}</Td>
              <Td>{driver.vehicle_number}</Td>
              <Td>{driver.phone}</Td>
              <Td>{driver.status}</Td>
              {/* <Td>
                {driver.ktp_url && (
                  <Image
                    src={`http://localhost:5000/uploads/${driver.ktp_url}`}
                    alt="KTP"
                    boxSize="60px"
                    objectFit="cover"
                    onClick={() => openFileModal(`http://localhost:5000/uploads/${driver.ktp_url}`)}
                    cursor="pointer"
                  />
                )}
              </Td> */}
              <Td>
                {driver.sim_url && (
                  <Image
                    src={`http://localhost:5000/uploads/${driver.sim_url}`}
                    alt="SIM"
                    boxSize="60px"
                    objectFit="cover"
                    onClick={() => openFileModal(`http://localhost:5000/uploads/${driver.sim_url}`)}
                    cursor="pointer"
                  />
                )}
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton icon={<MdEdit />} onClick={() => handleEdit(driver)} />
                  <IconButton icon={<MdDelete />} onClick={() => handleDelete(driver.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* File Preview Modal */}
      <Modal isOpen={isOpen} onClose={closeFileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>File Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={selectedFile} alt="File Preview" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DriverDashboard;

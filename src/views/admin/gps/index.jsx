import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Heading, Select } from '@chakra-ui/react';
import L from 'leaflet';

const GPSTrackingComponent = () => {
  const [vehicleType, setVehicleType] = useState('car'); 
  const [vehicles, setVehicles] = useState([]); 

  const fetchVehicles = async (type) => {
    // Ganti ini dengan API Anda jika tersedia
    const mockVehicleData = [
      { id: 1, position: [-6.1751, 106.8650], jenis_kendaraan: 'car' },
      { id: 2, position: [-6.1745, 106.8641], jenis_kendaraan: 'truck' },
      { id: 3, position: [-6.1760, 106.8630], jenis_kendaraan: 'motorcycle' },
    ];
    const filteredVehicles = mockVehicleData.filter(vehicle => vehicle.jenis_kendaraan === type);
    setVehicles(filteredVehicles);
  };

  useEffect(() => {
    fetchVehicles(vehicleType); 
  }, [vehicleType]);

  const createVehicleIcon = (type) => {
    let iconHtml;
    switch (type) {
      case 'car':
        iconHtml = `<div style="color: blue; font-size: 24px;">🚗</div>`;
        break;
      case 'motorcycle':
        iconHtml = `<div style="color: green; font-size: 24px;">🏍️</div>`;
        break;
      case 'truck':
        iconHtml = `<div style="color: red; font-size: 24px;">🚚</div>`;
        break;
      default:
        iconHtml = `<div style="font-size: 24px;">❓</div>`;
    }
    return L.divIcon({
      className: 'custom-icon',
      html: iconHtml,
      iconSize: [30, 30],
      popupAnchor: [0, -15],
    });
  };

  return (
    <Box padding="20px">
      <Heading as="h2" size="lg">Pelacakan GPS</Heading>
      <Select 
        placeholder="Pilih Jenis Kendaraan" 
        value={vehicleType} 
        onChange={(e) => setVehicleType(e.target.value)}
      >
        <option value="car">Mobil</option>
        <option value="motorcycle">Motor</option>
        <option value="truck">Truk</option>
      </Select>

      <MapContainer center={[-6.1751, 106.8650]} zoom={15} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map(vehicle => (
          <Marker 
            key={vehicle.id} 
            position={vehicle.position} 
            icon={createVehicleIcon(vehicle.jenis_kendaraan)}
          >
            <Popup>
              ID Kendaraan: {vehicle.id}<br />
              Jenis: {vehicle.jenis_kendaraan}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default GPSTrackingComponent;

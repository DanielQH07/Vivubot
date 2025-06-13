import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Text, VStack, HStack, Badge, Spinner, Alert, AlertIcon, Select } from "@chakra-ui/react";
import L from 'leaflet';
import { getRoute } from '../services/mapService';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DAY_COLORS = {
  day1: '#3182CE', // blue
  day2: '#38A169', // green
  day3: '#D69E2E', // yellow
};

const MapPreview = ({ route }) => {
  const [actualRoute, setActualRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('day1');

  useEffect(() => {
    const fetchRoute = async () => {
      // Chỉ gọi API khi có ít nhất 2 điểm
      if (!route || !route[selectedDay] || route[selectedDay].length < 2) {
        setActualRoute(null);
        if (route && route[selectedDay] && route[selectedDay].length < 2) {
          setError('Không đủ điểm để vẽ tuyến đường.');
        } else {
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Convert route locations to format expected by getRoute
        const locations = route[selectedDay].map(loc => ({
          lat: loc.latitude,
          lng: loc.longitude
        }));
        const routeData = await getRoute(locations);
        setActualRoute(routeData);
      } catch (err) {
        setError('Failed to fetch route data. Please try again later.');
        setActualRoute(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [route, selectedDay]);

  // Debug render
  // console.log('Current state:', {
  //   selectedDay,
  //   hasRoute: !!route,
  //   hasActualRoute: !!actualRoute,
  //   routeData: route?.[selectedDay],
  //   actualRouteData: actualRoute
  // });

  if (!route) {
    return (
      <Box h="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <Text color="gray.500">No route data available</Text>
      </Box>
    );
  }

  const currentRoute = route[selectedDay];
  const mapCenter = currentRoute && currentRoute.length > 0 
    ? [currentRoute[0].latitude, currentRoute[0].longitude]
    : [10.762622, 106.660172]; // Default to HCMC

  return (
    <Box position="relative" h="100%">
      {Object.keys(route).length > 1 && (
        <Box
          position="absolute"
          top={4}
          left={4}
          zIndex={1000}
          bg="white"
          p={2}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            size="sm"
          >
            {Object.keys(route).map(day => (
              <option key={day} value={day}>
                {day === 'day1' ? 'Day 1' : day === 'day2' ? 'Day 2' : 'Day 3'}
              </option>
            ))}
          </Select>
        </Box>
      )}

      {loading && (
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="whiteAlpha.800"
          zIndex={1000}
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}

      {error && (
        <Alert
          status="error"
          position="absolute"
          top={4}
          right={4}
          zIndex={1000}
        >
          <AlertIcon />
          {error}
        </Alert>
      )}

      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {actualRoute && actualRoute.length > 0 && (
          <Polyline
            positions={actualRoute}
            color={DAY_COLORS[selectedDay]}
            weight={4}
            opacity={0.7}
          />
        )}

        {currentRoute?.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <Box p={2}>
                <Text fontWeight="bold">{location.name}</Text>
                <Text fontSize="sm" color="gray.600">Time: {location.time}</Text>
                {location.description && (
                  <Text fontSize="sm" mt={1}>{location.description}</Text>
                )}
              </Box>
            </Popup>
            </Marker>
          ))}
    </MapContainer>
  </Box>
);
};

export default MapPreview; 
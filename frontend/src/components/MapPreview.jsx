import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Badge, 
  Spinner, 
  Alert, 
  AlertIcon, 
  IconButton, 
  Button, 
  Heading, 
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Switch,
  useColorModeValue,
  ButtonGroup
} from "@chakra-ui/react";
import { ChevronDownIcon, AddIcon, TimeIcon, CalendarIcon, InfoIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaExpand, FaCompress } from 'react-icons/fa';
import L from 'leaflet';
import { getRoute } from '../services/mapService';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Generate dynamic colors for days
const generateDayColor = (index) => {
  const colors = [
    '#3182CE', // blue
    '#38A169', // green
    '#D69E2E', // yellow
    '#E53E3E', // red
    '#805AD5', // purple
    '#DD6B20', // orange
    '#319795', // teal
    '#D53F8C', // pink
  ];
  return colors[index % colors.length];
};

const NAVBAR_HEIGHT = 64; // px

const MapPreview = ({ route, selectedDay = 'day1' }) => {
  const [actualRoute, setActualRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const fetchRoute = async () => {
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

  if (!route || Object.keys(route).length === 0) {
    return (
      <Box h="100%" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <Text color="gray.500">No route data available. Start a conversation to see your itinerary!</Text>
      </Box>
    );
  }

  const currentRoute = route[selectedDay];
  const mapCenter = currentRoute && currentRoute.length > 0 
    ? [currentRoute[0].latitude, currentRoute[0].longitude]
    : [16.0544, 108.2022]; // Default to Da Nang

  return (
    <Box
      position="relative"
      h={isFullscreen ? `calc(100vh - ${NAVBAR_HEIGHT}px)` : `calc(100vh - ${NAVBAR_HEIGHT}px)`}
      w={isFullscreen ? "100vw" : "100%"}
      overflow="hidden"
      bg="transparent"
      zIndex={isFullscreen ? 2000 : 'auto'}
      className={isFullscreen ? "map-container-fullscreen" : ""}
    >
      <style>
        {`
          .map-container-fullscreen {
            position: fixed !important;
            top: ${NAVBAR_HEIGHT}px !important;
            left: 0 !important;
            width: 100vw !important;
            height: calc(100vh - ${NAVBAR_HEIGHT}px) !important;
            z-index: 2000 !important;
          }
          .map-container-fullscreen .leaflet-container {
            height: 100% !important;
          }
        `}
      </style>
      {/* Fullscreen Toggle Button ở góc trái */}
      <Box
        position="absolute"
        top="1rem"
        left="1rem"
        zIndex={2100}
      >
        <IconButton
          aria-label="Toggle Fullscreen"
          icon={isFullscreen ? <FaCompress /> : <FaExpand />}
          onClick={handleFullscreenToggle}
          colorScheme="teal"
          variant="solid"
          size="lg"
          boxShadow="lg"
          borderRadius="full"
          _hover={{
            transform: "scale(1.1)",
            boxShadow: "xl"
          }}
          transition="all 0.2s"
        />
      </Box>
      <Box h="100%" w="100%">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {actualRoute && actualRoute.length > 0 && (
            <Polyline
              positions={actualRoute}
              color={generateDayColor(parseInt(selectedDay.replace('day', '')) - 1)}
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
      {/* Loading Spinner */}
      {loading && (
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="whiteAlpha.800"
          zIndex={2200}
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
      {/* Error Alert */}
      {error && (
        <Alert
          status="error"
          position="absolute"
          top={4}
          right={4}
          zIndex={2200}
        >
          <AlertIcon />
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default MapPreview; 
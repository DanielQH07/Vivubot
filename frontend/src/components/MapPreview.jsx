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
  ButtonGroup,
  Global
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

const MapPreview = ({ route }) => {
  const [actualRoute, setActualRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('day1');
  const [showDistances, setShowDistances] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const availableDays = Object.keys(route);

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    if (showItinerary && !isFullscreen) {
      setShowItinerary(false);
    }
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
    : [16.0544, 108.2022]; // Default to Da Nang

  return (
    <Box
      position="relative"
      h="calc(100vh - 64px)"
      w="100%"
      overflow="hidden"
      bg="transparent"
    >
      <Global
        styles={`
          .map-container-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 1000 !important;
          }
          .map-container-fullscreen .leaflet-container {
            height: 100% !important;
          }
        `}
      />
      <Flex h="100%" w="100%" direction="row">
        {/* MAP AREA */}
        <Box
          flex={1}
          minW={0}
          h="100%"
          position="relative"
          transition="width 0.4s cubic-bezier(.4,0,.2,1)"
          bg="transparent"
        >
          {/* Control Buttons */}
          <Box
            position="absolute"
            top={4}
            right={4}
            zIndex={1100}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            {!isFullscreen && (
              <IconButton
                aria-label="Show itinerary"
                icon={<HamburgerIcon />}
                onClick={() => setShowItinerary(true)}
                colorScheme="teal"
                variant="solid"
                size="md"
                boxShadow="md"
              />
            )}
            <IconButton
              aria-label="Toggle Fullscreen"
              icon={isFullscreen ? <FaCompress /> : <FaExpand />}
              onClick={handleFullscreenToggle}
              colorScheme="teal"
              variant="solid"
              size="md"
              boxShadow="md"
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
        </Box>
        {/* ITINERARY PANEL */}
        {showItinerary && (
          <Box
            w="400px"
            h="100%"
            bg={bgColor}
            borderLeft="1px solid"
            borderColor={borderColor}
            overflowY="auto"
            position="relative"
            boxShadow="xl"
            transition="transform 0.4s cubic-bezier(.4,0,.2,1)"
            zIndex={1200}
            display="flex"
            flexDirection="column"
            minW="400px"
            maxW="400px"
          >
            {/* Close button */}
            <Box position="absolute" top={4} right={4} zIndex={1300}>
              <IconButton
                aria-label="Close itinerary"
                icon={<CloseIcon />}
                onClick={() => setShowItinerary(false)}
                colorScheme="teal"
                variant="ghost"
                size="md"
                boxShadow="md"
              />
            </Box>
            {/* Tabs */}
            <Tabs isFitted display="flex" flexDirection="column" h="100%" mt={12}>
              <TabList>
                <Tab>Itinerary</Tab>
                <Tab>Calendar</Tab>
                <Tab>Bookings</Tab>
              </TabList>
              <TabPanels flex={1} overflowY="auto">
                <TabPanel p={0}>
                  {/* Itinerary Header */}
                  <Flex justify="space-between" align="center" p={4} borderBottom="1px solid" borderColor={borderColor}>
                    <HStack>
                      <Text fontWeight="bold">Itinerary</Text>
                      <Badge>{availableDays.length} days</Badge>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Distances</Text>
                      <Switch size="sm" isChecked={showDistances} onChange={(e) => setShowDistances(e.target.checked)} />
                    </HStack>
                  </Flex>
                  {/* Days Accordion */}
                  <Accordion allowMultiple defaultIndex={[0]}>
                    {availableDays.map((day, index) => (
                      <AccordionItem key={day} border="none">
                        <AccordionButton
                          onClick={() => setSelectedDay(day)}
                          bg={selectedDay === day ? 'gray.100' : 'transparent'}
                          _hover={{ bg: 'gray.50' }}
                          p={4}
                        >
                          <Box flex="1">
                            <HStack>
                              <Text fontWeight="semibold">Day {index + 1}</Text>
                              <Text color="gray.600">
                                {route[day][0]?.name || 'Untitled Day'}
                              </Text>
                            </HStack>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={4}>
                          <VStack align="stretch" spacing={4}>
                            {route[day].map((location, locIndex) => (
                              <Box
                                key={locIndex}
                                p={4}
                                bg="gray.50"
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderLeftColor={generateDayColor(index)}
                              >
                                <Text fontWeight="bold">{location.name}</Text>
                                <HStack spacing={2} mt={1} color="gray.600">
                                  <TimeIcon />
                                  <Text fontSize="sm">{location.time}</Text>
                                </HStack>
                                {location.description && (
                                  <Text fontSize="sm" mt={2} color="gray.600">
                                    {location.description}
                                  </Text>
                                )}
                              </Box>
                            ))}
                            <Button
                              leftIcon={<AddIcon />}
                              variant="outline"
                              size="sm"
                              w="full"
                            >
                              Add Activity
                            </Button>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabPanel>
                <TabPanel>
                  <Text p={4}>Calendar view coming soon...</Text>
                </TabPanel>
                <TabPanel>
                  <Text p={4}>Bookings view coming soon...</Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Flex>
      {/* Loading Spinner */}
      {loading && (
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="whiteAlpha.800"
          zIndex={2000}
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
          zIndex={2000}
        >
          <AlertIcon />
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default MapPreview; 
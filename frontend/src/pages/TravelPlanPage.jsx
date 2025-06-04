import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  Badge,
  Flex,
  useToast,
  Textarea,
  Select,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const TravelPlanPage = ({ user }) => {
  const [formData, setFormData] = useState({
    user_name: user?.username || '',
    departure: '',
    destination: '',
    outbound_date: '',
    return_date: '',
    adults_num: 1,
    children_num: 0,
    children_ages: '',
    restaurant_preference: '',
    budget: ''
  });
  const [travelPlans, setTravelPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiItinerary, setAiItinerary] = useState('');
  const [aiProvider, setAiProvider] = useState('gpt');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchTravelPlans();
  }, []);

  const fetchTravelPlans = async () => {
    try {
      const response = await fetch('/api/iterator');
      const data = await response.json();
      
      if (data.success) {
        setTravelPlans(data.data);
      }
    } catch (error) {
      console.error('Error fetching travel plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    });
  };

  const generateAIItinerary = async () => {
    setIsGeneratingAI(true);
    
    try {
      // Create prompt from form data
      const prompt = `Tôi muốn đi du lịch từ ${formData.departure} đến ${formData.destination} 
      từ ngày ${formData.outbound_date} đến ${formData.return_date}.
      Số người lớn: ${formData.adults_num}, số trẻ em: ${formData.children_num}
      ${formData.children_ages ? `Tuổi trẻ em: ${formData.children_ages}` : ''}
      ${formData.restaurant_preference ? `Sở thích ăn uống: ${formData.restaurant_preference}` : ''}
      ${formData.budget ? `Ngân sách: ${formData.budget} VND` : ''}
      
      Hãy lập kế hoạch du lịch chi tiết cho tôi.`;

      const response = await fetch('http://127.0.0.1:8000/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          ai_provider: aiProvider
        }),
      });

      const data = await response.json();
      console.log("GPT Output:", data);

      if (response.ok && data.success) {
        setAiItinerary(data.output);
        onOpen(); // Open modal to show AI result
        
        toast({
          title: "AI Itinerary Generated!",
          description: "Your AI travel itinerary has been generated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.detail || 'Failed to generate AI itinerary');
      }
    } catch (error) {
      console.error('Error generating AI itinerary:', error);
      toast({
        title: "AI Generation Failed",
        description: error.message || 'Please check if LangGraph service is running on port 8000',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/iterator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Travel plan created!",
          description: "Your travel plan has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Reset form
        setFormData({
          user_name: user?.username || '',
          departure: '',
          destination: '',
          outbound_date: '',
          return_date: '',
          adults_num: 1,
          children_num: 0,
          children_ages: '',
          restaurant_preference: '',
          budget: ''
        });
        
        // Refresh travel plans
        fetchTravelPlans();
      } else {
        toast({
          title: "Error",
          description: data.message || 'Failed to create travel plan',
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" color="teal.500">
          AI-Powered Travel Plan Manager
        </Heading>

        {/* Create Travel Plan Form */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <Heading size="md" mb={6}>
            Create New Travel Plan
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
              <Input
                name="user_name"
                placeholder="Your Name"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
              <Input
                name="departure"
                placeholder="Departure City"
                value={formData.departure}
                onChange={handleChange}
                required
              />
              <Input
                name="destination"
                placeholder="Destination City"
                value={formData.destination}
                onChange={handleChange}
                required
              />
              <Input
                name="outbound_date"
                type="date"
                placeholder="Outbound Date"
                value={formData.outbound_date}
                onChange={handleChange}
                required
              />
              <Input
                name="return_date"
                type="date"
                placeholder="Return Date"
                value={formData.return_date}
                onChange={handleChange}
                required
              />
              <Input
                name="adults_num"
                type="number"
                placeholder="Number of Adults"
                value={formData.adults_num}
                onChange={handleChange}
                min="1"
                required
              />
              <Input
                name="children_num"
                type="number"
                placeholder="Number of Children"
                value={formData.children_num}
                onChange={handleChange}
                min="0"
              />
              <Input
                name="children_ages"
                placeholder="Children Ages (e.g., 5, 8, 12)"
                value={formData.children_ages}
                onChange={handleChange}
              />
              <Input
                name="budget"
                type="number"
                placeholder="Budget (VND)"
                value={formData.budget}
                onChange={handleChange}
              />
            </SimpleGrid>
            
            <Input
              name="restaurant_preference"
              placeholder="Restaurant Preferences (optional)"
              value={formData.restaurant_preference}
              onChange={handleChange}
              mb={4}
            />

            {/* AI Generation Section */}
            <Box bg={useColorModeValue('blue.50', 'blue.900')} p={4} rounded="md" mb={4}>
              <VStack spacing={3}>
                <Heading size="sm" color="blue.600">
                  🤖 AI Travel Assistant
                </Heading>
                <HStack spacing={4} width="full">
                  <Select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    width="auto"
                  >
                    <option value="gpt">GPT (Monica/OpenAI)</option>
                    <option value="gemini">Google Gemini</option>
                  </Select>
                  <Button
                    colorScheme="blue"
                    onClick={generateAIItinerary}
                    isLoading={isGeneratingAI}
                    loadingText="Generating..."
                    isDisabled={!formData.departure || !formData.destination}
                    leftIcon={isGeneratingAI ? <Spinner size="sm" /> : null}
                  >
                    Generate AI Itinerary
                  </Button>
                </HStack>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Fill in departure and destination to generate AI travel recommendations
                </Text>
              </VStack>
            </Box>
            
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Save Travel Plan
            </Button>
          </form>
        </Box>

        {/* AI Itinerary Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>🤖 AI Generated Travel Itinerary</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={4}
                rounded="md"
                maxH="60vh"
                overflowY="auto"
              >
                <Text whiteSpace="pre-wrap" fontSize="sm">
                  {aiItinerary}
                </Text>
              </Box>
              <HStack mt={4} justify="center">
                <Badge colorScheme="blue">
                  Generated by {aiProvider.toUpperCase()}
                </Badge>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Travel Plans List */}
        <Box>
          <Heading size="md" mb={6}>
            Your Travel Plans
          </Heading>
          
          {isLoadingPlans ? (
            <Text>Loading travel plans...</Text>
          ) : travelPlans.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No travel plans yet. Create your first travel plan above!
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {travelPlans.map((plan) => (
                <Card key={plan._id} bg={useColorModeValue('white', 'gray.700')}>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Flex justify="space-between" width="full">
                        <Text fontWeight="bold" fontSize="lg">
                          {plan.departure} → {plan.destination}
                        </Text>
                        <Badge colorScheme="teal">Travel Plan</Badge>
                      </Flex>
                      
                      <Divider />
                      
                      <VStack align="start" spacing={2} fontSize="sm">
                        <Text><strong>Traveler:</strong> {plan.user_name}</Text>
                        <Text><strong>Outbound:</strong> {new Date(plan.outbound_date).toLocaleDateString()}</Text>
                        <Text><strong>Return:</strong> {new Date(plan.return_date).toLocaleDateString()}</Text>
                        <HStack>
                          <Text><strong>Adults:</strong> {plan.adults_num}</Text>
                          <Text><strong>Children:</strong> {plan.children_num}</Text>
                        </HStack>
                        {plan.children_ages && (
                          <Text><strong>Children Ages:</strong> {plan.children_ages}</Text>
                        )}
                        {plan.restaurant_preference && (
                          <Text><strong>Restaurant Preference:</strong> {plan.restaurant_preference}</Text>
                        )}
                        {plan.budget && (
                          <Text><strong>Budget:</strong> {plan.budget.toLocaleString()} VND</Text>
                        )}
                        <Text color="gray.500" fontSize="xs">
                          Created: {new Date(plan.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default TravelPlanPage; 
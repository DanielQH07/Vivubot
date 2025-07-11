// ChatPage.jsx
import React, { useState, useEffect } from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, Image, Menu, MenuButton, MenuList, MenuItem, Icon, Button, Divider, Spacer, Badge, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tabs, TabList, Tab, TabPanels, TabPanel, Switch, useToast } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons'
import { FaPaperPlane, FaExpand, FaCompress, FaList } from 'react-icons/fa'
import { Link, useLocation, useNavigate  } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MapPreview from '../components/MapPreview'
import { extractDestinationFromText, extractDestinationsFromPrompt } from '../services/destinationService'

// CSS để ẩn thanh cuộn
const globalStyles = `
  body {
    overflow: hidden !important;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const Sidebar = ({ sessions = [], onNewChat, onSelectSession, currentSessionId, onDeleteSession }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || "Username";

  return (
    <Flex
      direction="column"
      w="250px"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      p={4}
    >
      {/* Logo */}
      <VStack spacing={1} align="center">
        <Image src="/logo.png" boxSize="200px" objectFit="contain"/>
      </VStack>

      {/* Sticky Nav (Chat / Explore) */}
      <Box
        position="sticky"
        top="0"
        bg="gray.50"
        zIndex="1"
        py={2}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <VStack spacing={4} align="stretch">
          <Link to="/chat">
            <HStack
              color={pathname === '/chat' ? 'teal.500' : 'gray.600'}
              fontSize="lg"
              spacing={4}
              pl={4}
              _hover={{ color: 'teal.600' }}
            >
              <ChatIcon boxSize={5} />
              <Text>Chat</Text>
            </HStack>
          </Link>
          <Link to="/explore">
            <HStack
              color={pathname === '/explore' ? 'teal.500' : 'gray.600'}
              fontSize="lg"
              spacing={4}
              pl={4}
              _hover={{ color: 'teal.600' }}
            >
              <SearchIcon boxSize={5} />
              <Text>Explore</Text>
            </HStack>
          </Link>
        </VStack>
      </Box>

      {/* New Chat Button */}
      <Box mt={4} mb={2}>
        <IconButton colorScheme="teal" size="sm" onClick={onNewChat} icon={<ChatIcon />} aria-label="New Chat" w="full">
          New Chat
        </IconButton>
      </Box>

      {/* Session List */}
      <Box mt={4} flex={1} overflow="hidden">
        <Text mb={2} fontWeight="bold" color="gray.600">Lịch trình gần đây</Text>
        <VStack align="stretch" spacing={1} h="calc(100vh - 400px)" overflowY="auto">
          {sessions.map(s => (
            <Flex
              key={s.sessionId}
              p={2}
              borderRadius="md"
              bg={s.sessionId === currentSessionId ? 'teal.100' : 'gray.100'}
              cursor="pointer"
              onClick={() => onSelectSession(s.sessionId)}
              _hover={{ bg: 'teal.50' }}
              justify="space-between"
              align="center"
            >
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  Lịch trình {new Date(s.createdAt).toLocaleDateString('vi-VN')}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date(s.createdAt).toLocaleTimeString('vi-VN')} ({s.messageCount} tin nhắn)
                </Text>
              </Box>
              <IconButton
                size="xs"
                icon={<Icon as={DeleteIcon} />}
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(s.sessionId);
                }}
                aria-label="Delete session"
                ml={2}
              />
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* User Dropdown */}
      <Menu placement="top-start">
        <MenuButton as={Button} variant="ghost" px={2} py={1} rightIcon={<ChevronUpIcon />}>
          <HStack spacing={2}>
            <SettingsIcon />
            <Text>{username}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate('/preferences')}>
            Preferences
          </MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem('vivubot_session_id');
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const ItineraryPanel = ({ route, selectedDay, onDaySelect, isVisible, onClose }) => {
  if (!isVisible) return null;

  const availableDays = Object.keys(route || {});
  const [tabIndex, setTabIndex] = useState(0);
  const [showDistances, setShowDistances] = useState(false);

  // Xóa dữ liệu mẫu, để trống cho demo thực tế
  const tripTitle = "";
  const location = "";
  const dateRange = "";
  const travelers = "";

  // Xóa dữ liệu mẫu ngày tháng
  const dayLabels = [];

  return (
    <Box
      position="fixed"
      top="64px"
      right={0}
      w={["100vw", null, "420px"]}
      h="calc(100vh - 64px)"
      bg="white"
      borderLeft="1px solid"
      borderColor="gray.200"
      zIndex={2500}
      overflowY="auto"
      boxShadow="xl"
      p={0}
    >
      {/* Header */}
      <Box px={8} pt={8} pb={2} borderBottom="1px solid" borderColor="gray.100">
        <Text fontSize="2xl" fontWeight="bold">{tripTitle || "Your Trip"}</Text>
        <HStack mt={2} spacing={2}>
          {location && <Button size="sm" variant="outline">{location}</Button>}
          {dateRange && <Button size="sm" variant="outline">{dateRange}</Button>}
          {travelers && <Button size="sm" variant="outline">{travelers}</Button>}
        </HStack>
      </Box>
      {/* Tabs */}
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" mt={2} px={8}>
        <TabList borderBottom="1px solid" borderColor="gray.200">
          <Tab fontWeight="bold" _selected={{ borderBottom: "2px solid black" }}>Itinerary</Tab>
          <Tab fontWeight="bold" _selected={{ borderBottom: "2px solid black" }}>Calendar</Tab>
          <Tab fontWeight="bold" _selected={{ borderBottom: "2px solid black" }}>Bookings</Tab>
          <Spacer />
          <HStack spacing={2}>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <span style={{ fontSize: 20 }}>&#8592;</span>
            </Button>
          </HStack>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            {/* Itinerary summary */}
            <Flex align="center" px={2} py={2} borderBottom="1px solid" borderColor="gray.100">
              <Text fontWeight="bold" fontSize="lg">Itinerary</Text>
              <Text color="gray.500" ml={2}>{availableDays.length} days</Text>
              <Spacer />
              <Text color="gray.500" fontSize="sm" mr={2}>Distances</Text>
              <Switch size="md" isChecked={showDistances} onChange={e => setShowDistances(e.target.checked)} />
            </Flex>
            {/* Days Accordion */}
            <Accordion allowToggle defaultIndex={[0]} px={2}>
              {availableDays.map((day, idx) => (
                <AccordionItem key={day} border="none">
                  <AccordionButton
                    onClick={() => onDaySelect(day)}
                    bg={selectedDay === day ? 'gray.100' : 'transparent'}
                    _hover={{ bg: 'gray.50' }}
                    borderRadius="md"
                    py={4}
                  >
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold" fontSize="md">
                        Day {idx + 1} {route[day][0]?.name ? ` ${route[day][0]?.name}` : ''}
                        <Text as="span" color="gray.500" fontWeight="normal" fontSize="sm" ml={2}>
                          {dayLabels[idx]?.label || ''}
                        </Text>
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={2}>
                      {route[day]?.map((location, index) => (
                        <Box
                          key={index}
                          p={3}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          bg="gray.50"
                        >
                          <Text fontWeight="medium" color="teal.600">
                            {location.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Thời gian: {location.time}
                          </Text>
                          
                        </Box>
                      ))}
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
  );
};

const getSessionId = () => {
  let sessionId = localStorage.getItem('vivubot_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vivubot_session_id', sessionId);
  }
  return sessionId;
};

// Hàm tách JSON khỏi response text
const extractTextFromResponse = (text) => {
  try {
    // Tìm và loại bỏ phần JSON ở cuối
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return text.replace(jsonMatch[0], '').trim();
    }
    
    // Nếu không có code block, tìm JSON object
    const jsonObjectMatch = text.match(/\{[\s\S]*"route"[\s\S]*\}/);
    if (jsonObjectMatch) {
      return text.replace(jsonObjectMatch[0], '').trim();
    }
    
    return text;
  } catch (error) {
    return text;
  }
};

const Chat = ({ user, showItinerary, onCloseItinerary }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi, I'm vivu!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(() => {
    return {
      day1: [],
      day2: [],
      day3: []
    };
  });
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [sessions, setSessions] = useState([]);
  const [selectedDay, setSelectedDay] = useState('day1');
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [destinationInfo, setDestinationInfo] = useState(null);
  const toast = useToast();

  // Thêm global styles để ẩn thanh cuộn
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Lấy lịch sử chat khi load trang hoặc đổi sessionId
  useEffect(() => {
    axios.get(`http://localhost:5000/api/chat/history/${sessionId}`)
      .then(res => {
        if (res.data.messages?.length > 0) {
          // Loại bỏ tin nhắn trùng lặp và xử lý text bot
          const uniqueMessages = res.data.messages.reduce((acc, m) => {
            const existingIndex = acc.findIndex(msg => 
              msg.sender === m.sender && msg.message === m.message
            );
            if (existingIndex === -1) {
              // Nếu là bot thì loại bỏ code block JSON
              if (m.sender === 'bot') {
                acc.push({ sender: m.sender, text: extractTextFromResponse(m.message) });
              } else {
                acc.push({ sender: m.sender, text: m.message });
              }
            }
            return acc;
          }, []);
          setMessages(uniqueMessages);
        } else {
          setMessages([{ sender: 'bot', text: "Hi, I'm vivu!" }]);
        }
      })
      .catch(() => {
        setMessages([{ sender: 'bot', text: "Hi, I'm vivu!" }]);
      });
  }, [sessionId]);

  // Lấy danh sách các phiên chat
  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:5000/api/chat/sessions?userId=${user.id}`)
        .then(res => {
          setSessions(res.data.sessions || []);
        })
        .catch(() => setSessions([]));
    }
  }, [user, sessionId, loading]);

  // Lưu message vào backend
  const saveMessage = async (sender, message) => {
    try {
      await axios.post('http://localhost:5000/api/chat/save-message', {
        sessionId,
        sender,
        message,
        userId: user?.id
      });
    } catch (err) {}
  };

  // Xóa session
  const handleDeleteSession = async (sessionIdToDelete) => {
    try {
      await axios.delete(`http://localhost:5000/api/chat/session/${sessionIdToDelete}`);
      // Refresh sessions
      if (user && user.id) {
        const res = await axios.get(`http://localhost:5000/api/chat/sessions?userId=${user.id}`);
        setSessions(res.data.sessions || []);
      }
      // If deleted session is current session, create new one
      if (sessionIdToDelete === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  // Parse route data from markdown text
  const parseRouteFromText = (text) => {
    try {
      // First try to find JSON within markdown code blocks
      const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        const jsonStr = codeBlockMatch[1];
        const routeData = JSON.parse(jsonStr);
        if (routeData.route) {
          return routeData.route;
        }
      }
      
      // If no code block found, try to find raw JSON object
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const routeData = JSON.parse(jsonStr);
        if (routeData.route) {
          return routeData.route;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing route:', error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    await saveMessage('user', input);

    // Lấy nhiều địa danh từ prompt và lưu vào localStorage
    try {
      const destinations = await extractDestinationsFromPrompt(input);
      if (destinations && destinations.length > 0) {
        // Lưu vào allDestinations (không trùng lặp)
        const prev = JSON.parse(localStorage.getItem('allDestinations') || '[]');
        const merged = [...prev];
        destinations.forEach(dest => {
          if (!merged.find(d => d.name === dest.name)) merged.push(dest);
        });
        localStorage.setItem('allDestinations', JSON.stringify(merged));
        // Gửi event cho ExplorePage
        window.postMessage({
          type: 'DESTINATION_UPDATE',
          destinationInfo: destinations[0] // Ưu tiên hiển thị địa danh đầu tiên
        }, '*');
      }
    } catch (err) {
      console.error('Không thể extract nhiều địa danh:', err);
    }

    try {
      const res = await axios.post('http://localhost:8000/generate-itinerary', {
        text: input,
        ai_provider: "gpt",
        history: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      });
      
      console.log('API Response:', res.data);
      console.log('Raw output text:', res.data.output);

      // Parse route from the output text
      const routeData = parseRouteFromText(res.data.output);
      console.log('Parsed route data:', routeData);

      // Tách JSON khỏi response để hiển thị
      const displayText = extractTextFromResponse(res.data.output);
      const fullText = res.data.output || "No response from AI.";

      setMessages((msgs) => {
        const updated = [...msgs, { sender: 'bot', text: displayText }];
        saveMessage('bot', fullText); // Lưu full text (bao gồm JSON) vào database
        return updated;
      });

      if (routeData) {
        setRoute(routeData);
        setSelectedDay('day1'); // Reset to first day when new route is generated
        
        // Lấy thông tin địa danh từ route data nếu có
        const firstDay = routeData.day1 || routeData.day2 || routeData.day3;
        if (firstDay && firstDay.length > 0) {
          const firstLocation = firstDay[0];
          if (firstLocation && firstLocation.name) {
            try {
              const destinationData = await extractDestinationFromText(firstLocation.name);
              if (destinationData) {
                setDestinationInfo(destinationData);
                // Lưu vào localStorage để ExplorePage có thể truy cập
                localStorage.setItem('destinationInfo', JSON.stringify(destinationData));
                // Gửi event cho ExplorePage
                window.postMessage({
                  type: 'DESTINATION_UPDATE',
                  destinationInfo: destinationData
                }, '*');
                console.log('✅ Destination info extracted:', destinationData);
              }
            } catch (error) {
              console.log('⚠️ Could not extract destination info:', error);
            }
          }
        }
      } else {
        setRoute({ day1: [], day2: [], day3: [] });
      }
    } catch (err) {
      setMessages((msgs) => {
        const updated = [...msgs, { sender: 'bot', text: "Sorry, I couldn't get a response from the AI." }];
        saveMessage('bot', "Sorry, I couldn't get a response from the AI.");
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // Tạo phiên chat mới
  const handleNewChat = () => {
    const newSessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vivubot_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([{ sender: 'bot', text: "Hi, I'm vivu!" }]);
    setRoute(() => {
      return {
        day1: [],
        day2: [],
        day3: []
      };
    });
    setSelectedDay('day1');
    setIsMapFullscreen(false);
  };

  // Chọn lại phiên chat cũ
  const handleSelectSession = (sid) => {
    localStorage.setItem('vivubot_session_id', sid);
    setSessionId(sid);
    setSelectedDay('day1');
    setIsMapFullscreen(false);
  };

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        currentSessionId={sessionId}
      />
  
      {/* Chat area */}
      <Flex direction="column" flex="2" p={6} bg="gray.50" overflow="hidden">
        {/* Messages */}
        <Box flex={1} my={6} overflowY="auto" maxH="calc(100vh - 180px)">
          <VStack spacing={4} align="stretch">
            {/* Header */}
            <Box>
              <Text fontSize="2xl" fontWeight="bold">Where will you go today?</Text>
              <Text color="gray.500">You can ask me anything about travel.</Text>
            </Box>
  
            {messages.map((msg, idx) => (
              <HStack
                key={idx}
                alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                bg={msg.sender === 'user' ? 'gray.50' : 'teal.50'}
                p={3}
                borderRadius="md"
                maxW="80%"
                w="fit-content"
              >
                {msg.sender === 'bot' ? (
                  <Box
                    border="1px solid"
                    borderColor="teal.200"
                    borderRadius="md"
                    p={1}
                    sx={{
                      'h1, h2, h3, h4, h5, h6': {
                        color: 'teal.700',
                        marginTop: 2,
                        marginBottom: 2,
                      },
                      'ul, ol': { pl: 4, mb: 2 },
                      li: { mb: 1 },
                      strong: { color: 'teal.800' },
                      code: { background: '#f4f4f4', px: 1, borderRadius: 2 },
                    }}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Box>
                ) : (
                  <Text>{msg.text}</Text>
                )}
              </HStack>
            ))}
            {loading && (
              <HStack
                alignSelf="flex-start"
                bg="gray.100"
                p={3}
                borderRadius="md"
                maxW="60%"
              >
                <Text>...</Text>
              </HStack>
            )}
          </VStack>
        </Box>
  
        {/* Input */}
        <InputGroup>
          <Input
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            isDisabled={loading}
          />
          <InputRightElement>
            <IconButton
              size="sm"
              aria-label="send"
              icon={<FaPaperPlane />}
              variant="ghost"
              onClick={sendMessage}
              isLoading={loading}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
  
      {/* Map Preview with Controls */}
      <Box 
        flex="1" 
        h="100vh" 
        position="relative"
        overflow="hidden"
        borderLeft="1px solid" 
        borderColor="gray.200"
      >
        <Box 
          h="100%" 
          w="100%"
          className={isMapFullscreen ? "map-container-fullscreen" : ""}
        >
          <MapPreview route={route} selectedDay={selectedDay} />
        </Box>
        {/* Itinerary Panel */}
        <ItineraryPanel
          route={route}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          isVisible={showItinerary}
          onClose={onCloseItinerary}
        />
      </Box>
    </Flex>
  );
}  

export default Chat
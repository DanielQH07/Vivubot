// ChatPage.jsx
import React, { useState } from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, Image, Menu, MenuButton, MenuList, MenuItem, Icon, Button } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon  } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'
import { Link, useLocation, useNavigate  } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import SplitPane from 'react-split-pane'
import MapPreview from '../components/MapPreview'

const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      w="200px"
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

      {/* Nav */}
      <Box mt={12}>
        <VStack spacing={8} align="stretch">
          <Link to="/chat">
            <HStack
              color={pathname === '/chat' ? 'teal.500' : 'gray.600'}
              fontSize="lg"
              spacing={4}
              pl={6} // 👈 đẩy cụm này ra giữa hơn một chút, vẫn align trái
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
              pl={6} // 👈 cùng độ lệch cho đều nhau
            >
              <SearchIcon boxSize={5} />
              <Text>Explore</Text>
            </HStack>
          </Link>
        </VStack>
      </Box>

      {/* Spacer đẩy phần dropdown xuống dưới cùng */}
      <Box flex={1} />

      {/* User Dropdown */}
      <Menu placement="top-start">
        <MenuButton as={Button} variant="ghost" px={2} py={1} rightIcon={<ChevronUpIcon />}>
          <HStack spacing={2}>
            <SettingsIcon />
            <Text>Username</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate('/')}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi, I'm vivu!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/generate-itinerary', {
        text: input,
        ai_provider: "gpt" // or "gemini"
      });
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: res.data.output || "No response from AI." }
      ]);
      setRoute(res.data.route);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: "Sorry, I couldn't get a response from the AI." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <SplitPane split="vertical" minSize={300} defaultSize="75%">
      <Box>
        <Flex h="100vh">
          <Sidebar />

          {/* Chat Content */}
          <Flex direction="column" flex={1} p={6} bg="white">
            {/* Header */}
            <VStack align="start" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">Where will you go today?</Text>
              <Text color="gray.500">You can ask me anything about travel.</Text>
            </VStack>

            {/* Messages */}
            <Box flex={1} my={6} overflowY="auto">
              <VStack spacing={4} align="stretch">
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
                          'h1, h2, h3, h4, h5, h6': { color: 'teal.700', marginTop: 2, marginBottom: 2 },
                          'ul, ol': { pl: 4, mb: 2 },
                          'li': { mb: 1 },
                          'strong': { color: 'teal.800' },
                          'code': { background: '#f4f4f4', px: 1, borderRadius: 2 }
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
                  <HStack alignSelf="flex-start" bg="gray.100" p={3} borderRadius="md" maxW="60%">
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
                onChange={e => setInput(e.target.value)}
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
        </Flex>
      </Box>
      <Box>
        <MapPreview route={[[10.7769, 106.7009], [11.9404, 108.4583]]} />
      </Box>
    </SplitPane>
  )
}

export default Chat
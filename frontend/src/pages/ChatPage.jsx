// ChatPage.jsx
import React, { useState } from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, Image } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Split from 'react-split'
import MapPreview from '../components/MapPreview'

const Sidebar = () => {
  const { pathname } = useLocation()
  return (
    <Flex
      direction="column"
      w="200px"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      justify="space-between"
      p={4}
    >
      {/* Logo */}
      <VStack spacing={1} align="center">
        <Image src="/logo.svg" boxSize="60px" />
        <Text fontWeight="bold">VIVUBOT</Text>
        <Text fontSize="sm" color="gray.500">TRAVEL ASSISTANT</Text>
      </VStack>

      {/* Nav */}
      <VStack spacing={6} align="stretch" mt={8}>
        <Link to="/chat">
          <HStack color={pathname === '/chat' ? 'teal.500' : 'gray.600'}>
            <ChatIcon />
            <Text>Chat</Text>
          </HStack>
        </Link>
        <Link to="/explore">
          <HStack color={pathname === '/explore' ? 'teal.500' : 'gray.600'}>
            <SearchIcon />
            <Text>Explore</Text>
          </HStack>
        </Link>
      </VStack>

      {/* User */}
      <HStack spacing={2}>
        <SettingsIcon />
        <Text>username</Text>
      </HStack>
    </Flex>
  )
}

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
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" h="100vh">
        <Split
          className="split"
          sizes={[60, 40]}
          minSize={200}
          gutterSize={8}
          direction="horizontal"
          style={{ display: 'flex', height: '100%' }}
        >
          <Box p={4} h="100%" overflow="auto">
            {/* Chat content here */}
            <VStack align="start" spacing={2}>
              <Text fontSize="2xl" fontWeight="bold">Where will you go today?</Text>
              <Text color="gray.500">You can ask me anything about travel.</Text>
            </VStack>

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
          </Box>
          <Box h="100%" overflow="auto">
            <MapPreview />
          </Box>
        </Split>
      </Box>
    </Flex>
  )
}

export default Chat

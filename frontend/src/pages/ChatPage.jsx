// ChatPage.jsx

import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, Image, Menu, MenuButton, MenuList, MenuItem, Icon, Button } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon  } from '@chakra-ui/icons'
import React, { useState, useEffect } from 'react'

import { FaPaperPlane } from 'react-icons/fa'
import { Link, useLocation, useNavigate  } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import SplitPane from 'react-split-pane'
import MapPreview from '../components/MapPreview'

const Sidebar = ({ sessions = [], onNewChat, onSelectSession, currentSessionId }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate();
  return (
    <Flex
      direction="column"
      w="220px"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      p={4}
    >
      {/* Logo */}
      <VStack spacing={1} align="center">
        <Image src="/logo.svg" boxSize="60px" />
        <Text fontWeight="bold">VIVUBOT</Text>
        <Text fontSize="sm" color="gray.500">TRAVEL ASSISTANT</Text>
      </VStack>

      {/* New Chat Button */}
      <Box mt={4} mb={2}>
        <IconButton colorScheme="teal" size="sm" onClick={onNewChat} icon={<ChatIcon />} aria-label="New Chat" w="full">
          New Chat
        </IconButton>
      </Box>

      {/* Session List */}
      <VStack align="stretch" spacing={1} maxH="300px" overflowY="auto" mb={4}>
        {sessions.map(s => (
          <Box
            key={s.sessionId}
            p={2}
            borderRadius="md"
            bg={s.sessionId === currentSessionId ? 'teal.100' : 'gray.100'}
            cursor="pointer"
            onClick={() => onSelectSession(s.sessionId)}
            _hover={{ bg: 'teal.50' }}
          >
            <Text fontSize="sm" noOfLines={1}>
              {s.sessionId.slice(0, 8)}... ({s.messageCount} msg)
            </Text>
            <Text fontSize="xs" color="gray.500">
              {new Date(s.createdAt).toLocaleString()}
            </Text>
          </Box>
        ))}
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
      <Menu>
        <MenuButton as={Button} leftIcon={<SettingsIcon />} size="sm" colorScheme="gray">
          username
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => {
            localStorage.removeItem('vivubot_session_id');
            localStorage.removeItem('token'); // nếu có
            window.location.href = '/login'; // hoặc dùng navigate('/login');
          }}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>

    </Flex>
  )
}

const getSessionId = () => {
  let sessionId = localStorage.getItem('vivubot_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vivubot_session_id', sessionId);
  }
  return sessionId;
};

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi, I'm vivu!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const [sessions, setSessions] = useState([]);

  // Lấy lịch sử chat khi load trang hoặc đổi sessionId
  useEffect(() => {
    axios.get(`http://localhost:5000/api/chat/history/${sessionId}`)
      .then(res => {
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages.map(m => ({ sender: m.sender, text: m.message })));
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
        userId: user && user.id ? user.id : undefined
      });
    } catch (err) {}
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    await saveMessage('user', input);

    // Tạo history từ các messages trước đó (bỏ message bot chào hỏi nếu cần)
    const buildHistory = (msgs) =>
      msgs
        .filter(m => m.sender === 'user' || m.sender === 'bot')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

    try {
      const res = await axios.post('http://localhost:8000/generate-itinerary', {
        text: input,
        ai_provider: "gpt" // or "gemini"
      });
      setMessages((msgs) => {
        const updated = [...msgs, { sender: 'bot', text: res.data.output || "No response from AI." }];
        saveMessage('bot', res.data.output || "No response from AI.");
        return updated;
      });
      setRoute(res.data.route);
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
    setRoute([]);
  };

  // Chọn lại phiên chat cũ
  const handleSelectSession = (sid) => {
    localStorage.setItem('vivubot_session_id', sid);
    setSessionId(sid);
  };

  return (
    <SplitPane split="vertical" minSize={220} defaultSize={220}>
      <Sidebar
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        currentSessionId={sessionId}
      />
      <SplitPane split="vertical" minSize={300} defaultSize="60%">
        <Box p={4} h="100vh" overflow="auto">
          {/* Chat content here */}
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
        </Box>
  
        <Box h="100vh" overflow="auto">
          <MapPreview />
        </Box>
      </SplitPane>
    </SplitPane>
  );  
}

export default Chat
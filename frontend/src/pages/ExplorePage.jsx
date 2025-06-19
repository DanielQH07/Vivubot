// ExplorePage.jsx
import React, { useState, useEffect } from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, SimpleGrid, Image, Button, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const username = user?.username || "Username"

  return (
    <Flex
      direction="column"
      w="250px" // Đặt width giống ChatPage
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      p={4}
    >
      {/* Logo */}
      <VStack spacing={1} align="center">
        <Image src="/logo.png" boxSize="200px" objectFit="contain" />
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

      {/* Spacer đẩy phần dropdown xuống dưới cùng */}
      <Box flex={1} />

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
              localStorage.removeItem('vivubot_session_id')
              localStorage.removeItem('token')
              navigate('/')
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

const Explore = () => {
  // Xóa dữ liệu mẫu, để trống cho demo thực tế
  const [destinationInfo, setDestinationInfo] = useState(null);
  const [allDestinations, setAllDestinations] = useState([]);
  const toast = useToast();

  // Lấy thông tin địa danh từ localStorage (được lưu từ ChatPage)
  useEffect(() => {
    const storedDestinationInfo = localStorage.getItem('destinationInfo');
    if (storedDestinationInfo) {
      try {
        setDestinationInfo(JSON.parse(storedDestinationInfo));
      } catch (error) {
        console.error('Error parsing destination info:', error);
      }
    }
  }, []);

  // Lấy tất cả địa điểm đã lưu từ localStorage
  useEffect(() => {
    const storedDestinations = localStorage.getItem('allDestinations');
    if (storedDestinations) {
      try {
        setAllDestinations(JSON.parse(storedDestinations));
      } catch (error) {
        console.error('Error parsing all destinations:', error);
      }
    }
  }, []);

  // Lắng nghe sự kiện từ ChatPage khi có thông tin địa danh mới
  useEffect(() => {
    const handleDestinationUpdate = (event) => {
      if (event.data && event.data.type === 'DESTINATION_UPDATE') {
        const newDestination = event.data.destinationInfo;
        setDestinationInfo(newDestination);
        localStorage.setItem('destinationInfo', JSON.stringify(newDestination));
        
        // Thêm vào danh sách tất cả địa điểm (tránh trùng lặp)
        setAllDestinations(prev => {
          const exists = prev.find(dest => dest.name === newDestination.name);
          if (!exists) {
            const updated = [...prev, newDestination];
            localStorage.setItem('allDestinations', JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }
    };

    window.addEventListener('message', handleDestinationUpdate);
    return () => window.removeEventListener('message', handleDestinationUpdate);
  }, []);

  // Hàm mở Wikipedia
  const openWikipedia = (placeName) => {
    const encodedName = encodeURIComponent(placeName.replace(/ /g, '_'));
    const wikiUrl = `https://vi.wikipedia.org/wiki/${encodedName}`;
    window.open(wikiUrl, '_blank');
  };

  // Tạo danh sách items từ tất cả địa điểm
  const items = allDestinations.map(dest => ({
    title: dest.name,
    subtitle: dest.type,
    img: dest.thumbnail || 'https://via.placeholder.com/150',
    selected: false,
    wikiUrl: `https://vi.wikipedia.org/wiki/${encodeURIComponent(dest.name.replace(/ /g, '_'))}`
  }));

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Explore Content */}
      <Flex direction="column" flex="1" p={6} bg="gray.50" overflow="hidden">
        {/* Search & Filters */}
        <HStack mb={4}>
          <InputGroup>
            <Input placeholder="Search" />
            <InputRightElement>
              <IconButton
                size="sm"
                aria-label="search"
                icon={<FaPaperPlane />}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
          <Button leftIcon={<FiFilter />} variant="outline">
            Filters
          </Button>
        </HStack>

        {/* Location & Title */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold">Explore Destinations</Text>
          <Text fontSize="md" color="gray.600" mt={2}>
            {allDestinations.length > 0 
              ? `Discover ${allDestinations.length} destinations from your travel history`
              : "Start a conversation to explore places!"
            }
          </Text>
        </Box>

        {/* Results Grid */}
        <Box my={6} overflowY="auto" flex="1">
          {items.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {items.map((it, idx) => (
                <Box
                  key={idx}
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  overflow="hidden"
                  cursor="pointer"
                  _hover={{ 
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    borderColor: 'teal.300'
                  }}
                  transition="all 0.2s"
                  onClick={() => openWikipedia(it.title)}
                >
                  <Image src={it.img} alt={it.title} w="100%" h="120px" objectFit="cover" />
                  <VStack align="start" p={3} spacing={1}>
                    <Text fontWeight="semibold" color="teal.600">{it.title}</Text>
                    <Text fontSize="sm" color="gray.500">{it.subtitle}</Text>
                    <Text fontSize="xs" color="teal.500" mt={1}>
                      Click to view on Wikipedia →
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">No destinations yet. Start a conversation to explore places!</Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export default Explore
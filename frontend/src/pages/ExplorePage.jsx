// ExplorePage.jsx
import React, { useState } from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, SimpleGrid, Image, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MapPreview from '../components/MapPreview'

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
  // Dữ liệu mẫu cho map preview, bạn có thể thay đổi hoặc lấy từ API
  const [route] = useState({
    day1: [
      { name: 'Chùa Dơi', latitude: 9.602521, longitude: 105.968685, time: '06:00' },
      { name: 'Bến Ninh Kiều', latitude: 10.034024, longitude: 105.782779, time: '14:00' },
    ],
    day2: [
      { name: 'Khách sạn tại Cần Thơ', latitude: 10.034024, longitude: 105.782779, time: '05:00' },
      { name: 'Chợ nổi Cái Răng', latitude: 10.015526, longitude: 105.768924, time: '06:00' },
      { name: 'Chùa Vĩnh Tràng', latitude: 10.360859, longitude: 106.354061, time: '14:00' },
    ],
    day3: [
      { name: 'Khách sạn tại TP.HCM', latitude: 10.762622, longitude: 106.660172, time: '08:00' },
      { name: 'Dinh Độc Lập', latitude: 10.776887, longitude: 106.695554, time: '08:30' },
      { name: 'Chợ Bến Thành', latitude: 10.772376, longitude: 106.698390, time: '13:30' },
    ],
  })

  const items = [
    { title: 'Giangnam Coffee', subtitle: 'Coffee', img: 'https://via.placeholder.com/150' },
    { title: 'Go! Di An', subtitle: 'Supermarket', img: 'https://via.placeholder.com/150' },
    { title: 'Six Coffee', subtitle: 'Coffee', img: 'https://via.placeholder.com/150' },
    { title: 'King BBQ', subtitle: 'Restaurant', img: 'https://via.placeholder.com/150', selected: true },
  ]

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Explore Content */}
      <Flex direction="column" flex="2" p={6} bg="gray.50" overflow="hidden"> {/* Đặt flex="2" và bg="gray.50" giống ChatPage */}
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
          <Text fontSize="2xl" fontWeight="bold">Explore things to do</Text>
        </Box>

        {/* Results Grid */}
        <Box my={6} overflowY="auto"> {/* Thêm overflowY giống ChatPage */}
          <SimpleGrid columns={2} spacing={4}>
            {items.map((it, idx) => (
              <Box
                key={idx}
                bg="gray.50"
                borderRadius="md"
                border={it.selected ? '2px solid teal' : 'none'}
                overflow="hidden"
              >
                <Image src={it.img} alt={it.title} w="100%" h="120px" objectFit="cover" />
                <VStack align="start" p={3} spacing={1}>
                  <Text fontWeight="semibold">{it.title}</Text>
                  <Text fontSize="sm" color="gray.500">{it.subtitle}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>

      {/* Map Preview */}
      <Box flex="1" h="100vh" overflowY="auto" borderLeft="1px solid" borderColor="gray.200"> {/* Cấu trúc giống ChatPage */}
        <MapPreview route={route} />
      </Box>
    </Flex>
  )
}

export default Explore
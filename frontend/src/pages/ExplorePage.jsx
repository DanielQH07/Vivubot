// ExplorePage.jsx
import React, { useState } from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, SimpleGrid, Image, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
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
        <Image src="/logo.png" boxSize="200px" objectFit="contain" />
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
  
}

const Explore = () => {
  const items = [
    { title: 'Giangnam Coffee', subtitle: 'Coffee', img: 'https://via.placeholder.com/150' },
    { title: 'Go! Di An', subtitle: 'Supermarket', img: 'https://via.placeholder.com/150' },
    { title: 'Six Coffee', subtitle: 'Coffee', img: 'https://via.placeholder.com/150' },
    { title: 'King BBQ', subtitle: 'Restaurant', img: 'https://via.placeholder.com/150', selected: true },
  ]

  return (
    <Flex h="100vh">
      <Sidebar />

      {/* Explore Content */}
      <Flex direction="column" flex={1} p={6} bg="white">
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
        <Text fontSize="lg" fontWeight="semibold">Ký túc xá khu B, HCMC</Text>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Explore things to do</Text>

        {/* Results Grid */}
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
      </Flex>

      {/* Preview / Map */}
      <Box w="300px" h="100vh" bg="gray.50">
        <Image
          src="https://via.placeholder.com/300x800?text=Map+Preview"
          alt="map preview"
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>
    </Flex>
  )
}

export default Explore
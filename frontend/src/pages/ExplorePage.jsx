// ExplorePage.jsx
import React from 'react'
import { Flex, Box, VStack, HStack, Text, Input, InputGroup, InputRightElement, IconButton, SimpleGrid, Image, Button } from '@chakra-ui/react'
import { ChatIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

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

import { Container } from '@chakra-ui/react';
import React from 'react'
import { Flex, Text, Button, HStack } from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaPlaneDeparture } from "react-icons/fa";

const Navbar = ({ isAuthenticated, user, onLogout, onToggleItinerary }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <Container maxW={"1140px"} px={4}>
            <Flex 
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base: "column",
                    md: "row"
                }}
            >
                <Text
                    fontSize={["2xl", "3xl"]}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient="linear(to-r, teal.500, green.500)"
                    bgClip="text"
                >
                    <Link to={"/"}>
                    <HStack spacing={2} align="center">
                        <Text fontWeight="bold" color="teal.600">VIVUBOT</Text>
                        <FaPlaneDeparture size={20} color="#319795" />
                    </HStack>
                    </Link>
                </Text>

                <HStack spacing={2} alignItems={"center"} justifyContent={"center"}>
                    {isAuthenticated ? (
                        <>
                            <Text fontSize="sm" color="gray.600">
                                Welcome, {user?.username}!
                            </Text>
                            <Button colorScheme={"teal"} size="sm" onClick={onToggleItinerary}>
                                Travel Plans
                            </Button>
                            <Button colorScheme="blue" size="sm" onClick={() => {
                                if (location.pathname === '/preferences') {
                                    navigate('/chat');
                                } else {
                                    navigate('/preferences');
                                }
                            }}>
                                Preferences
                            </Button>
                            <Button colorScheme={"red"} size="sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to={"/login"}>
                                <Button colorScheme={"teal"} size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to={"/signup"}>
                                <Button colorScheme={"blue"} size="sm">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <MoonIcon fontSize={20} /> : <SunIcon fontSize={20} />}
                    </Button>
                </HStack>
            </Flex>
        </Container>
    );
}

export default Navbar;

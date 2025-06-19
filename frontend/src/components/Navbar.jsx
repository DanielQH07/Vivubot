import { Container } from '@chakra-ui/react';
import React from 'react'
import { Flex, Text, Button, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = ({ isAuthenticated, user, onLogout, onToggleItinerary }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    
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
                    <Link to={"/"}>VivuBot ✈️</Link>
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

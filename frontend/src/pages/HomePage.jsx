import React, { useEffect } from 'react'
import { Container, VStack, Box, Heading, Text, useColorModeValue, SimpleGrid } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'

const HomePage = () => {
    const {fetchProducts, products} = useProductStore()
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts]);
    console.log(products)
  return (
    <div>
        <Container maxW="container.xl" py={12}>
            <VStack spacing={4} align="stretch">
                <Text
                    fontsize={"30"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r,cyan.400, blue.500)"}
                    bgClip={"text"}
                    textAlign={"center"}
                >
                    Current Products 🚀
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w={"full"}>
                
                
                </SimpleGrid>

                <Text fontSize="xl" textAlign={"center"} fontWeight='bold' color="gray.500">
                    No products available at the moment. Please check back later.{" "}
                    <Link to={"/create"}>
                        <Text as="span" color={useColorModeValue("teal.500", "teal.300")} _hover={{ textDecoration: "underline" }}>
                            Create a product
                        </Text>
                    </Link>
                </Text>
                

            </VStack>
        </Container>
    </div>
  )
}

export default HomePage;

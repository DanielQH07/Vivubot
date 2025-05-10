// src/pages/CreatePage.jsx
import React, {  useState } from 'react';
import {
  Container,
  Input,
  VStack,
  Box,
  Heading,
  Button,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useProductStore } from '../store/product';

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: ''
  });
  const toast = useToast();


  const {createProduct}=useProductStore()
    
  const handleAddProduct = async() => {
    const {success, message} = await createProduct(newProduct);
    if(success) {
      toast({
        title: "Product created",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: ''
    });
};

  return (
    <Container maxW="container.sm" py={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg" textAlign="center">
          Create New Product
        </Heading>
        <Box
          w="full"
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              type="number"
              name="price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />
            <Button colorScheme="blue" onClick={handleAddProduct} w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;

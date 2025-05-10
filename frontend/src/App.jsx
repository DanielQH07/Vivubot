

import { Route, Routes } from "react-router-dom";
import {Box} from "@chakra-ui/react";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { useColorModeValue } from "@chakra-ui/react";

function App() {
  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100","gray.900")}>
      <Navbar />
      {/* <Box p={4}> */}
        {/* <HomePage /> */}
      {/* </Box> */}
      {/* <CreatePage /> */}
      {/* <Box p={4}> */}
        {/* <CreatePage /> */}
      {/* </Box> */}
      {/* <HomePage /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </Box>
  );
}

export default App;

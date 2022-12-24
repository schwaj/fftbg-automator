import { ChakraProvider, Container, Box } from "@chakra-ui/react";
import { AutomatorForm } from "./pages/AutomatorForm/AutomatorForm";
import { Header } from "./components/Header";
import { theme } from "./theme";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box h="calc(100vh)">
      <Header />
      <Container py={20} bgColor="white">
        <AutomatorForm />
      </Container>
    </Box>
  </ChakraProvider>
);

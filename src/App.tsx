import { ChakraProvider, Container, Box } from "@chakra-ui/react";
import { AutomatorForm } from "./pages/AutomatorForm/AutomatorForm";
import { Header } from "./components/Header";
import { theme } from "./theme";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Header />
    <Container py={20} h="calc(100vh - 60px)" bgColor="gray.700">
      <AutomatorForm />
    </Container>
  </ChakraProvider>
);

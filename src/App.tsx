import { ChakraProvider, Container } from "@chakra-ui/react";
import { AutomatorForm } from "./pages/AutomatorForm/AutomatorForm";
import { Header } from "./components/Header";
import { theme } from "./theme";
import { AuthContextProvider } from "./contexts/AuthContext";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <Header />
        <Container py={20} h="calc(100vh - 60px)">
          <AutomatorForm />
        </Container>
      </AuthContextProvider>
    </ChakraProvider>
  );
};

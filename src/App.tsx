import { ChakraProvider, Container } from "@chakra-ui/react";
import { AutomatorForm } from "./pages/AutomatorForm/AutomatorForm";
import { Header } from "./components/Header";
import { theme } from "./theme";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Footer } from "./components/Footer";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <Header />
        <Container py={20} minH="calc(100vh - 120px)">
          <AutomatorForm />
        </Container>
        <Footer />
      </AuthContextProvider>
    </ChakraProvider>
  );
};

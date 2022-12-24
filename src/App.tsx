import { ChakraProvider } from "@chakra-ui/react";
import { AutomatorForm } from "./pages/AutomatorForm/AutomatorForm";
import { Header } from "./components/Header";
import { theme } from "./theme";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Header />
    <AutomatorForm />
  </ChakraProvider>
);

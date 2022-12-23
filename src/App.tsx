import { ChakraProvider, theme } from "@chakra-ui/react";
import { AutomatorForm } from "./pages/AutomatorForm/AutomatorForm";
import { Header } from "./components/Header";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Header />
    <AutomatorForm />
  </ChakraProvider>
);

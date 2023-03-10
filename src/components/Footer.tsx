import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Flex,
  HStack,
  IconButton,
  Link,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.600", "white")}
      minH={15}
      py={2}
      px={4}
      borderTop={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
      align={"center"}
      justifyContent="space-between"
    >
      <Flex w={"30%"} justifyContent={"flex-start"}>
        <IconButton
          bg={"chakra-body-bg"}
          icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
          aria-label={"toggle color mode"}
          onClick={toggleColorMode}
        ></IconButton>
      </Flex>
      <Flex w={"30%"} justifyContent={"center"}>
        <Link
          href={"https://donate.stripe.com/test_6oE6qf42GbMo35uaEE"}
          target="_blank"
        >
          Tip me!
        </Link>
      </Flex>
      <Flex w={"30%"} justifyContent={"flex-end"}>
        <HStack spacing={2}>
          <Link href="https://github.com/schwaj" target={"_blank"}>
            <FaGithub />
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
};

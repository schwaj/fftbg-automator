import { useColorModeValue } from "@chakra-ui/color-mode";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { IconButton, useColorMode } from "@chakra-ui/react";

export const Header = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        justifyContent="space-between"
      >
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "gray.300")}
          >
            FFT Battleground Automator
          </Text>
        </Flex>
        <Flex>
          <IconButton
            icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
            aria-label={"toggle color mode"}
            onClick={toggleColorMode}
          ></IconButton>
        </Flex>
      </Flex>
    </Box>
  );
};

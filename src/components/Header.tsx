import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { Avatar, Button } from "@chakra-ui/react";
import axios from "axios";
import qs from "qs";
import { useContext, useEffect } from "react";
import { FaTwitch } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import { isDev } from "../utils/environmentUtil";

export const Header = () => {
  const {
    setAccessToken,
    username,
    setUsername,
    profileImageUrl,
    setProfileImageUrl,
  } = useContext(AuthContext);
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=tientobnk7149q8q9on9w5bqshhn3d&redirect_uri=${
    isDev()
      ? "http://localhost:3000/fftbg-automator"
      : "https://schwaj.github.io/fftbg-automator/"
  }&scope=chat%3Aread+chat%3Aedit`;

  useEffect(() => {
    const token =
      qs.parse(window.location.hash)["#access_token"]?.toString() ?? null;

    setAccessToken(token);
    if (token && !username) {
      axios
        .get("https://api.twitch.tv/helix/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Client-Id": "tientobnk7149q8q9on9w5bqshhn3d",
          },
        })
        .then((response: any) => {
          setProfileImageUrl(response.data.data[0].profile_image_url);
          setUsername(response.data.data[0].login);
        });
    }
  }, [setAccessToken, setProfileImageUrl, setUsername, username]);

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={15}
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
        <HStack spacing={5}>
          {profileImageUrl ? (
            <Avatar name={username ?? ""} src={profileImageUrl} h={10} w={10} />
          ) : (
            <Link style={{ textDecoration: "none" }} href={twitchAuthUrl}>
              <Button mr={5} colorScheme={"purple"}>
                <Flex>
                  <FaTwitch />
                  <Box ml={2}>Login</Box>
                </Flex>
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

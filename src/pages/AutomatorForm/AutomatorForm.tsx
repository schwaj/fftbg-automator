import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Center, Link, Stack } from "@chakra-ui/layout";
import { Field, FieldAttributes, Form, Formik, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { Client } from "tmi.js";
import { sleep } from "../../utils/sleepUtil";
import { betAmounts, betTargets, TabItems } from "./consts";
import { getBetTextFromInput, getFightTextFromInput } from "./helpers";
import { ExternalLinkIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { BettingTab } from "./BettingTab";
import { FightingTab } from "./FightingTab";
import { useToast } from "@chakra-ui/toast";
import { Checkbox, Flex } from "@chakra-ui/react";

export type FormValuesType = {
  token: string;
  username: string;
  bet: boolean;
  amount: string;
  target: string;
  fight: boolean;
  fighterType: string;
  fighterParameters: string;
};

const twitchChatCreds = localStorage.getItem("twitchChatCreds");
const parsedTiwtchCreds = JSON.parse(twitchChatCreds ?? "{}");

const initialValues = {
  token: !!twitchChatCreds ? parsedTiwtchCreds.token : "",
  username: !!twitchChatCreds ? parsedTiwtchCreds.username : "",
  bet: true,
  amount: betAmounts[0].value,
  target: betTargets[0].value,
  fight: false,
  fighterType: "",
  fighterParameters: "",
};

export const AutomatorForm = () => {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasClientConnected, setHasClientConnected] = useState(false);
  const [chatClient, setChatClient] = useState<Client | null>(null);
  const [betCount, setBetCount] = useState(0);
  const formRef = useRef<FormikValues>() as any;

  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (!chatClient && isLoggedIn) {
      const client = new Client({
        options: { debug: true, messagesLogLevel: "info" },
        connection: {
          reconnect: true,
          secure: true,
        },

        identity: {
          username: formRef.current.values.username,
          password: formRef.current.values.token,
        },

        channels: ["FFTBattleground"],
      });
      setChatClient(client);
    }
    if (chatClient && isLoggedIn && !hasClientConnected) {
      chatClient
        ?.connect()
        .then(() => {
          let isTournamentActive = false;
          let betCounter = 0;
          setHasClientConnected(true);
          chatClient.on("message", (channel, tags, message, self) => {
            if (self) return;

            const lowerMessage = message.toLowerCase();

            if (tags.username === "fftbattleground") {
              if (
                formRef.current.values.bet === true &&
                lowerMessage.includes("betting is open for")
              ) {
                sleep(Math.floor(Math.random() * 20000) + 5000).then(() => {
                  chatClient.say(
                    channel,
                    getBetTextFromInput(
                      formRef.current.values.amount,
                      formRef.current.values.target
                    )
                  );
                  betCounter++;
                  setBetCount(betCounter);
                });
              }
              if (
                lowerMessage.includes(
                  "you may now !fight to enter the tournament!"
                ) ||
                lowerMessage.includes(
                  "the !fight command can now be used to enter the upcoming tournament"
                )
              ) {
                if (!isTournamentActive) {
                  isTournamentActive = true;
                }
                if (formRef.current.values.fight === true) {
                  sleep(Math.floor(Math.random() * 20000) + 5000).then(() => {
                    chatClient.say(
                      channel,
                      getFightTextFromInput(
                        formRef.current.values.fighterType.value,
                        formRef.current.values.fighterParameters
                      )
                    );
                  });
                }
              }
            }
            if (
              lowerMessage.includes("was victorious! last chance to purchase")
            ) {
              if (isTournamentActive) {
                chatClient?.disconnect().then(() => {
                  isTournamentActive = false;
                  setHasClientConnected(false);
                  setIsLoggedIn(false);
                  setChatClient(null);
                  toast({
                    title: "Tournament finished.",
                    description: "You can start again whenever!",
                    status: "success",
                    position: "top",
                    duration: null,
                    isClosable: true,
                  });
                });
              }
            }
          });
        })
        .catch(() => {
          toast({
            title: "Error.",
            description: "Something went wrong connecting to chat",
            status: "error",
            isClosable: true,
            position: "top",
          });
          setHasClientConnected(false);
          setIsLoggedIn(false);
        });
    }
    if (chatClient && !isLoggedIn && hasClientConnected) {
      chatClient?.disconnect().then(() => {
        setHasClientConnected(false);
        setChatClient(null);
      });
    }
  }, [isLoggedIn, hasClientConnected, chatClient, formRef, toast, betCount]);

  const handleStartClientClick = () => {
    const token = formRef.current.values.token;
    const username = formRef.current.values.username;
    if (token && username && formRef.current.values.rememberMe) {
      localStorage.setItem(
        "twitchChatCreds",
        JSON.stringify({ token, username })
      );
    }
    if (!formRef.current.values.rememberMe) {
      localStorage.removeItem("twitchChatCreds");
    }
    setIsLoggedIn(true);
  };

  const handleStopClientClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Link
        verticalAlign="center"
        href="https://twitchapps.com/tmi/"
        isExternal
      >
        Click here to get your Twitch token
        <ExternalLinkIcon mx="2px" />
      </Link>
      <Formik
        enableReinitialize
        onSubmit={() => {}}
        initialValues={initialValues}
        innerRef={formRef}
      >
        {({ values }) => (
          <Form>
            <Stack direction="row" spacing={5} mt={5}>
              <FormControl variant="floating">
                <Field name="token">
                  {({ field }: FieldAttributes<any>) => (
                    <InputGroup>
                      <Input
                        {...field}
                        placeholder=" "
                        type={showPassword ? "text" : "password"}
                      />
                      <FormLabel>Twitch Token</FormLabel>
                      <InputRightElement width="2.5rem">
                        <IconButton
                          h="1.75rem"
                          size="xs"
                          onClick={handleShowPasswordClick}
                          icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          aria-label={"view token"}
                          bg="clear"
                        ></IconButton>
                      </InputRightElement>
                    </InputGroup>
                  )}
                </Field>
              </FormControl>
              <FormControl marginTop={5} variant="floating">
                <Field name="username">
                  {({ field }: FieldAttributes<any>) => (
                    <>
                      <Input {...field} placeholder=" " />
                      <FormLabel>Twitch Username</FormLabel>
                    </>
                  )}
                </Field>
              </FormControl>
            </Stack>
            <Flex flexDir="row" mt={2}>
              <Field name="rememberMe">
                {({ field }: FieldAttributes<any>) => (
                  <Checkbox {...field} defaultChecked={!!twitchChatCreds} />
                )}
              </Field>
              <FormLabel ml={1} mb={0}>
                Remember Me
              </FormLabel>
            </Flex>
            <Tabs isFitted mt={2}>
              <TabList>
                {Object.values(TabItems).map((tab) => (
                  <Tab key={tab}>{tab}</Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <BettingTab formValues={values} betCount={betCount} />
                </TabPanel>
                <TabPanel>
                  <FightingTab formValues={values} />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Center>
              <ButtonGroup mt={5}>
                <Button
                  width="8rem"
                  disabled={isLoggedIn}
                  onClick={() => {
                    handleStartClientClick();
                  }}
                >
                  Start
                </Button>
                <Button
                  disabled={!isLoggedIn}
                  onClick={handleStopClientClick}
                  width="8rem"
                >
                  End
                </Button>
              </ButtonGroup>
            </Center>
          </Form>
        )}
      </Formik>
    </div>
  );
};

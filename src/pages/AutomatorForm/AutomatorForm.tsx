import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Center, Container, Link, Stack } from "@chakra-ui/layout";
import { Field, Form, Formik, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { Client } from "tmi.js";
import { sleep } from "../../utils/sleepUtil";
import { betAmounts, betTargets, TabItems } from "./consts";
import { getBetTextFromInput } from "./helpers";
import { ExternalLinkIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { BettingTab } from "./BettingTab";
import { FightingTab } from "./FightingTab";
import { useToast } from "@chakra-ui/toast";

export type FormValuesType = {
  token: string;
  username: string;
  bet: boolean;
  amount: string;
  target: string;
  fight: boolean;
  fighterType: string;
};

const initialValues = {
  token: "",
  username: "",
  bet: true,
  amount: betAmounts[0].value,
  target: betTargets[0].value,
  fight: true,
  fighterType: "",
};
export const AutomatorForm = () => {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasClientConnected, setHasClientConnected] = useState(false);
  const [chatClient, setChatClient] = useState<Client | null>(null);
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [isTournamentComplete, setIsTournamentComplete] = useState(false);
  const formRef = useRef<FormikValues>() as any;

  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (isTournamentComplete) {
      toast({
        title: "Tournament finished.",
        description: "You can start again whenever!",
        status: "success",
        duration: null,
        isClosable: true,
      });
    }
  }, [isTournamentComplete, toast]);

  useEffect(() => {
    console.log(formRef.current.values);
    if (!chatClient) {
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
      chatClient?.connect().then(() => {
        setHasClientConnected(true);
        chatClient.on("message", async (channel, tags, message, self) => {
          if (self) return;

          const lowerMessage = message.toLowerCase();

          if (tags.username === "fftbattleground") {
            if (lowerMessage.includes("betting is open for")) {
              await sleep(Math.floor(Math.random() * 20000) + 5000);
              chatClient.say(
                channel,
                getBetTextFromInput(
                  formRef.current.values.amount,
                  formRef.current.values.target
                )
              );
            }
            if (lowerMessage.includes("!fight")) {
              if (isTournamentActive) {
                setIsTournamentComplete(true);
                await chatClient.disconnect();
              }
              if (!isTournamentActive) {
                setIsTournamentActive(true);
              }
            }
          }
        });
      });
    }
    if (chatClient && !isLoggedIn && hasClientConnected) {
      chatClient?.disconnect().then(() => {
        setHasClientConnected(false);
      });
    }
  }, [isLoggedIn, hasClientConnected, chatClient, isTournamentActive]);

  const handleStartClientClick = () => {
    setIsLoggedIn(true);
    setIsTournamentComplete(false);
  };

  const handleStopClientClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Container marginTop={20}>
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
          {({ values, handleChange }) => (
            <Form>
              <Stack direction="row" spacing={5} mt={5}>
                <FormControl variant="floating">
                  <Field name="token">
                    {({ field }: any) => (
                      <InputGroup>
                        <Input
                          {...field}
                          placeholder=" "
                          type={showPassword ? "text" : "password"}
                        />
                        <FormLabel>Twitch Token</FormLabel>
                        <InputRightElement width="2.5rem">
                          {/* {showPassword ? <ViewIcon /> : <ViewOffIcon />} */}
                          <IconButton
                            h="1.75rem"
                            size="xs"
                            onClick={handleShowPasswordClick}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
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
                    {({ field }: any) => (
                      <>
                        <Input {...field} placeholder=" " />
                        <FormLabel>Twitch Username</FormLabel>
                      </>
                    )}
                  </Field>
                </FormControl>
              </Stack>
              <Tabs isFitted mt={2}>
                <TabList>
                  {Object.values(TabItems).map((tab) => (
                    <Tab key={tab}>{tab}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <BettingTab formValues={formRef?.current?.values ?? {}} />
                  </TabPanel>
                  <TabPanel>
                    <FightingTab formValues={formRef?.current?.values ?? {}} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <Center>
                <ButtonGroup marginTop={5}>
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
      </Container>
    </div>
  );
};

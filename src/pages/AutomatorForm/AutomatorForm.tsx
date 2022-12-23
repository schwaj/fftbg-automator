import { Button, ButtonGroup } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Center, Container, Link, Stack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Field, Form, Formik } from "formik";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { client, Client } from "tmi.js";
import { sleep } from "../../utils/sleepUtil";
import { BetAmounts, BetTargets, TabItems } from "./consts";
import { getBetTextFromInput } from "./helpers";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { Checkbox } from "@chakra-ui/checkbox";
import { BettingTab } from "./BettingTab";
import { FightingTab } from "./FightingTab";
import { useToast } from "@chakra-ui/toast";

const initialValues = {
  token: "",
  name: "",
  bet: true,
  amount: Object.values(BetAmounts)[0],
  target: Object.values(BetTargets)[0],
  fight: true,
};
export const AutomatorForm = () => {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasClientConnected, setHasClientConnected] = useState(false);
  const [chatClient, setChatClient] = useState<Client | null>(null);
  const [formFields, setFormFields] = useState(initialValues);
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [isTournamentComplete, setIsTournamentComplete] = useState(false);

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
    if (!chatClient) {
      const client = new Client({
        options: { debug: true, messagesLogLevel: "info" },
        connection: {
          reconnect: true,
          secure: true,
        },

        identity: {
          username: formFields.name,
          password: formFields.token,
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
                getBetTextFromInput(formFields.amount, formFields.target)
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
  }, [
    isLoggedIn,
    hasClientConnected,
    chatClient,
    formFields,
    isTournamentActive,
  ]);

  const handleEnableBettingOnChange = (e: BaseSyntheticEvent) => {
    setFormFields({ ...formFields, bet: e.target.checked });
  };

  const handleEnableFightingOnChange = (e: BaseSyntheticEvent) => {
    setFormFields({ ...formFields, fight: e.target.checked });
  };

  const handleAmountOnChange = (e: BaseSyntheticEvent) => {
    setFormFields({ ...formFields, amount: e.target.value });
  };

  const handleTargetOnChange = (e: BaseSyntheticEvent) => {
    setFormFields({ ...formFields, target: e.target.value });
  };

  const handleStartClientClick = (values: any) => {
    setFormFields({ ...values });
    setIsLoggedIn(true);
    setIsTournamentComplete(false);
  };

  const handleStopClientClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Container marginTop={20}>
        <Formik
          enableReinitialize
          onSubmit={() => {}}
          initialValues={initialValues}
        >
          {({ values }) => (
            <Form>
              <Stack direction="row">
                <Field type="text" name="token">
                  {({ field }: any) => (
                    <FormControl>
                      <FormLabel>
                        <Link
                          verticalAlign="center"
                          href="https://twitchapps.com/tmi/"
                          isExternal
                        >
                          Twitch Oath Token <ExternalLinkIcon mx="2px" />
                        </Link>
                      </FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          placeholder="Twitch Token"
                          type={showPassword ? "text" : "password"}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleShowPasswordClick}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Field type="text" name="name">
                  {({ field }: any) => (
                    <FormControl marginTop={5}>
                      <FormLabel>Twitch Username</FormLabel>
                      <Input {...field} placeholder="Twitch Username" />
                    </FormControl>
                  )}
                </Field>
              </Stack>
              <Tabs isFitted>
                <TabList>
                  {Object.keys(TabItems).map((tab) => {
                    return <Tab key={tab}>{tab}</Tab>;
                  })}
                </TabList>
                <TabPanels>
                  <BettingTab
                    formFields={formFields}
                    handleEnableBettingOnChange={handleEnableBettingOnChange}
                    handleAmountOnChange={handleAmountOnChange}
                    handleTargetOnChange={handleTargetOnChange}
                  />
                  <TabPanel>
                    <FightingTab
                      formFields={formFields}
                      handleEnableFightingOnChange={
                        handleEnableFightingOnChange
                      }
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <Center>
                <ButtonGroup marginTop={5}>
                  <Button
                    width="8rem"
                    type="button"
                    disabled={isLoggedIn}
                    onClick={() => {
                      handleStartClientClick(values);
                    }}
                  >
                    Start
                  </Button>
                  <Button
                    disabled={!isLoggedIn}
                    type="button"
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

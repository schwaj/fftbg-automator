import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import { Form, Formik, FormikValues } from "formik";
import { useEffect, useRef, useState, useContext } from "react";
import { Client } from "tmi.js";
import { sleep } from "../../utils/sleepUtil";
import { betAmounts, betTargets, TabItems } from "./consts";
import { getBetTextFromInput, getFightTextFromInput } from "./helpers";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { BettingTab } from "./BettingTab";
import { FightingTab } from "./FightingTab";
import { useToast } from "@chakra-ui/toast";
import { AuthContext } from "../../contexts/AuthContext";

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
  const { accessToken, username } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasClientConnected, setHasClientConnected] = useState(false);
  const [chatClient, setChatClient] = useState<Client | null>(null);
  const [betCount, setBetCount] = useState(0);
  const [hasEnteredFight, setHasEnteredFight] = useState(false);
  const formRef = useRef<FormikValues>() as any;

  useEffect(() => {
    if (!chatClient && isLoggedIn) {
      const client = new Client({
        options: { debug: true, messagesLogLevel: "info" },
        connection: {
          reconnect: true,
          secure: true,
        },

        identity: {
          username: username ?? "",
          password: accessToken ?? "",
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
                    setHasEnteredFight(true);
                  });
                }
              }
            }
            if (lowerMessage.includes("before this tournament ends")) {
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
  }, [
    isLoggedIn,
    hasClientConnected,
    chatClient,
    formRef,
    toast,
    betCount,
    username,
    accessToken,
  ]);

  const handleOnSubmit = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
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
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        onSubmit={handleOnSubmit}
        initialValues={initialValues}
        innerRef={formRef}
      >
        {({ values }) => (
          <Form>
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
                  <FightingTab
                    formValues={values}
                    hasEnteredFight={hasEnteredFight}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Center>
              {isLoggedIn ? (
                <Button type="submit" width="8rem" colorScheme={"red"}>
                  {"Stop"}
                </Button>
              ) : (
                <Button type="submit" width="8rem" colorScheme={"green"}>
                  {"Start"}
                </Button>
              )}
            </Center>
          </Form>
        )}
      </Formik>
    </>
  );
};

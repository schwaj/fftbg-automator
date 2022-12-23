import { Button, ButtonGroup } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Center, Container, Link } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Field, Form, Formik } from "formik";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Client } from "tmi.js";
import { sleep } from "../../utils/sleepUtil";
import { BetAmounts, BetTargets } from "./consts";
import { getBetTextFromInput } from "./helpers";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const initialValues = {
  token: "",
  name: "",
  amount: Object.keys(BetAmounts)[0],
  target: Object.keys(BetTargets)[0],
};
export const AutomatorForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasClientConnected, setHasClientConnected] = useState(false);
  const [chatClient, setChatClient] = useState<Client | null>(null);
  const [formFields, setFormFields] = useState(initialValues);

  const handleShowPasswordClick = () => setShowPassword(!showPassword);

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
          }
        });
      });
    }
    if (chatClient && !isLoggedIn && hasClientConnected) {
      chatClient?.disconnect().then(() => {
        setHasClientConnected(false);
      });
    }
  }, [isLoggedIn, hasClientConnected, chatClient, formFields]);

  const handleAmountOnChange = (e: BaseSyntheticEvent) => {
    setFormFields({ ...formFields, amount: e.target.value });
  };

  const handleTargetOnChange = (e: BaseSyntheticEvent) => {
    setFormFields({ ...formFields, target: e.target.value });
  };

  const handleStartClientClick = (values: any) => {
    setFormFields({ ...values });
    setIsLoggedIn(true);
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
              <Field type="select" name="amount">
                {({ field }: any) => (
                  <FormControl marginTop={5}>
                    <FormLabel>Bet Amount</FormLabel>
                    <Select
                      {...field}
                      value={formFields.amount}
                      onChange={handleAmountOnChange}
                    >
                      {Object.entries(BetAmounts).map(([k, v]) => {
                        return (
                          <option key={v} value={v}>
                            {k}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </Field>
              <Field type="select" name="target">
                {({ field }: any) => (
                  <FormControl marginTop={5}>
                    <FormLabel>Bet Target</FormLabel>
                    <Select
                      {...field}
                      value={formFields.target}
                      onChange={handleTargetOnChange}
                    >
                      {Object.entries(BetTargets).map(([k, v]) => {
                        return (
                          <option key={v} value={v}>
                            {k}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </Field>
              <Center>
                Example Bet:{" "}
                {getBetTextFromInput(formFields.amount, formFields.target)}
              </Center>
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

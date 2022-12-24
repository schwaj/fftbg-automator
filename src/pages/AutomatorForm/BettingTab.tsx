import { FormLabel } from "@chakra-ui/form-control";
import { Center } from "@chakra-ui/layout";
import { Box, Flex } from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import { Switch } from "@chakra-ui/switch";
import { Field, FieldAttributes } from "formik";
import { betAmounts, betTargets } from "./consts";
import { getBetTextFromInput } from "./helpers";

export type BettingTabPropsType = {
  formValues: any;
  betCount: number;
};

export const BettingTab = ({ formValues, betCount }: BettingTabPropsType) => {
  return (
    <>
      <Flex flexDir="row" justify="space-between">
        <Box display="flex">
          <Field name="bet">
            {({ field }: FieldAttributes<any>) => (
              <Switch {...field} defaultChecked></Switch>
            )}
          </Field>
          <FormLabel mb={0} ml={2}>
            Enable betting
          </FormLabel>
        </Box>
        Bet counter: {betCount}
      </Flex>
      <FormLabel mt={5}>Bet Amount</FormLabel>
      <Field name="amount">
        {({ field }: FieldAttributes<any>) => (
          <Select {...field}>
            {betAmounts.map(({ label, value }) => {
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </Select>
        )}
      </Field>
      <FormLabel mt={5}>Bet Target</FormLabel>
      <Field name="target">
        {({ field }: FieldAttributes<any>) => (
          <Select {...field}>
            {betTargets.map(({ label, value }) => {
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </Select>
        )}
      </Field>
      <Center mt={3}>
        <span>
          <strong>Chat Text:</strong>{" "}
          {getBetTextFromInput(formValues.amount, formValues.target)}
        </span>
      </Center>
    </>
  );
};

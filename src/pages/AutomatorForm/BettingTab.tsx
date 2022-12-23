import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Stack, Center } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { TabPanel } from "@chakra-ui/tabs";
import { Field } from "formik";
import { BaseSyntheticEvent } from "react";
import { BetAmounts, BetTargets } from "./consts";
import { getBetTextFromInput } from "./helpers";

export type BettingTabPropsType = {
  formFields: { amount: string; target: string };
  handleEnableBettingOnChange: (e: BaseSyntheticEvent) => void;
  handleAmountOnChange: (e: BaseSyntheticEvent) => void;
  handleTargetOnChange: (e: BaseSyntheticEvent) => void;
};

export const BettingTab = ({
  formFields,
  handleEnableBettingOnChange,
  handleAmountOnChange,
  handleTargetOnChange,
}: BettingTabPropsType) => {
  return (
    <TabPanel>
      <Field type="checkbox" name="bet">
        {({ field }: any) => (
          <FormControl>
            <Stack direction="row">
              <Checkbox
                {...field}
                defaultChecked
                onChange={handleEnableBettingOnChange}
              ></Checkbox>
              <FormLabel>Enable betting</FormLabel>
            </Stack>
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
        <span>
          <strong>Example:</strong>{" "}
          {getBetTextFromInput(formFields.amount, formFields.target)}
        </span>
      </Center>
    </TabPanel>
  );
};

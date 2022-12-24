import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Stack, Center } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Switch } from "@chakra-ui/switch";
import { TabPanel } from "@chakra-ui/tabs";
import { Field } from "formik";
import { betAmounts, betTargets } from "./consts";
import { getBetTextFromInput } from "./helpers";

export type BettingTabPropsType = {
  formValues: any;
};

export const BettingTab = ({ formValues }: BettingTabPropsType) => {
  return (
    <TabPanel>
      <Field type="checkbox" name="bet">
        {({ field }: any) => (
          <FormControl>
            <Stack direction="row">
              <FormLabel>Enable betting</FormLabel>
              <Switch {...field} defaultChecked></Switch>
            </Stack>
          </FormControl>
        )}
      </Field>
      <Field name="amount">
        {({ field }: any) => (
          <FormControl marginTop={5}>
            <FormLabel>Bet Amount</FormLabel>
            <Select {...field}>
              {betAmounts.map(({ label, value }) => {
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Field>
      <Field name="target">
        {({ field }: any) => (
          <FormControl marginTop={5}>
            <FormLabel>Bet Target</FormLabel>
            <Select {...field}>
              {betTargets.map(({ label, value }) => {
                return (
                  <option key={value} value={value}>
                    {label}
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
          {getBetTextFromInput(formValues.amount, formValues.target)}
        </span>
      </Center>
    </TabPanel>
  );
};

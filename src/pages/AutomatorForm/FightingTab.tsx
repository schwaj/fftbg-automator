import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Stack } from "@chakra-ui/layout";
import { Field } from "formik";
import { BaseSyntheticEvent } from "react";

export type FightingTabPropsType = {
  formFields: { amount: string; target: string };
  handleEnableFightingOnChange: (e: BaseSyntheticEvent) => void;
};

export const FightingTab = ({
  handleEnableFightingOnChange,
}: FightingTabPropsType) => {
  return (
    <Field type="checkbox" name="fight">
      {({ field }: any) => (
        <FormControl>
          <Stack direction="row">
            <Checkbox
              {...field}
              defaultChecked
              onChange={handleEnableFightingOnChange}
            ></Checkbox>
            <FormLabel>Enable fighting</FormLabel>
          </Stack>
        </FormControl>
      )}
    </Field>
  );
};

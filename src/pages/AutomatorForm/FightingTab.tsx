import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Center, Stack } from "@chakra-ui/layout";
import { Field } from "formik";
import { FighterTypes, jobs, monsters } from "./consts";
import { Switch } from "@chakra-ui/switch";
import { Select } from "chakra-react-select";
import { getFightTextFromInput } from "./helpers";

export type FightingTabPropsType = {
  formValues: any;
};

export const FightingTab = ({ formValues }: FightingTabPropsType) => {
  const fighterGroups = [
    {
      label: FighterTypes.HUMAN,
      options: jobs,
    },
    {
      label: FighterTypes.MONSTER,
      options: monsters,
    },
  ];

  return (
    <>
      <Field type="checkbox" name="fight">
        {({ field }: any) => (
          <FormControl>
            <Stack direction="row">
              <FormLabel>Enable fighting?</FormLabel>
              <Switch {...field}></Switch>
            </Stack>
          </FormControl>
        )}
      </Field>
      <Field name="fighterType">
        {({ field, form }: any) => (
          <FormControl pt={5}>
            <FormLabel>Fighter Type</FormLabel>
            <Select
              {...field}
              isClearable
              isSearchable
              options={fighterGroups}
              value={
                fighterGroups
                  ? fighterGroups.find((group) => {
                      return group.options.find(
                        (option) => option.value === field.value
                      );
                    })
                  : ""
              }
              onChange={(option) => form.setFieldValue(field.name, option)}
              placeholder="Select fighter type..."
            ></Select>
          </FormControl>
        )}
      </Field>
      <Center>
        {formValues?.fighterType?.value && (
          <span>
            <strong>Example:</strong>{" "}
            {getFightTextFromInput(formValues.fighterType.value)}
          </span>
        )}
      </Center>
    </>
  );
};

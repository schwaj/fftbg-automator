import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Center } from "@chakra-ui/layout";
import { Field, FieldAttributes } from "formik";
import { FighterTypes, jobs, monsters } from "./consts";
import { Switch } from "@chakra-ui/switch";
import { Select } from "chakra-react-select";
import { getFightTextFromInput } from "./helpers";
import { Flex, Input } from "@chakra-ui/react";

export type FightingTabPropsType = {
  formValues: any;
};

export const FightingTab = ({ formValues }: FightingTabPropsType) => {
  const fighterGroups = [
    { label: "Misc", options: [{ label: "Random", value: " " }] },
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
      <Flex flexDir="row">
        <Field name="fight" as={Switch} />
        <FormLabel mb={0} ml={2}>
          Enable fighting
        </FormLabel>
      </Flex>
      <Field name="fighterType">
        {({ field, form }: FieldAttributes<any>) => (
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
      <FormControl mt={5}>
        <FormLabel>Extra Parameters</FormLabel>
        <Field name="fighterParameters">
          {({ field }: FieldAttributes<any>) => (
            <>
              <Input {...field} placeholder="i.e. gearedup -preferredarms" />
            </>
          )}
        </Field>
      </FormControl>
      <Center mt={3}>
        <span>
          <strong>Chat Text: </strong>
          {getFightTextFromInput(
            formValues.fighterType.value,
            formValues.fighterParameters
          )}
        </span>
      </Center>
    </>
  );
};

import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Center } from "@chakra-ui/layout";
import { Field, FieldAttributes } from "formik";
import { FighterTypes, jobs, monsters } from "./consts";
import { Switch } from "@chakra-ui/switch";
import { Select } from "chakra-react-select";
import { getFightTextFromInput } from "./helpers";
import { Box, Flex, Input } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export type FightingTabPropsType = {
  formValues: any;
  hasEnteredFight: boolean;
};

export const FightingTab = ({
  formValues,
  hasEnteredFight,
}: FightingTabPropsType) => {
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
      <Flex flexDir="row" justifyContent={"space-between"}>
        <Box display="flex">
          <Field name="fight" as={Switch} />
          <FormLabel mb={0} ml={2}>
            Enable fighting
          </FormLabel>
        </Box>
        <Box display="flex" alignItems={"center"}>
          <FormLabel mb={0}>Fight Entered: </FormLabel>
          {hasEnteredFight ? (
            <CheckIcon color="green" />
          ) : (
            <CloseIcon color={"red"} />
          )}
        </Box>
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

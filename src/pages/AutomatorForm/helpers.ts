export const getBetTextFromInput = (amount: string, target: string): string => {
  return `!${amount} ${target}`;
};

export const getFightTextFromInput = (
  fighterType: string | undefined,
  fighterParameters: string | undefined
): string => {
  return `!fight ${fighterType ?? ""} ${fighterParameters ?? ""}`.trim();
};

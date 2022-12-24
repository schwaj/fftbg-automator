export const getBetTextFromInput = (amount: string, target: string): string => {
  return `!${amount} ${target}`;
};

export const getFightTextFromInput = (
  fighterType: string,
  fighterParameters: string
): string => {
  return `!fight ${fighterType} ${fighterParameters ?? ""}`.trim();
};

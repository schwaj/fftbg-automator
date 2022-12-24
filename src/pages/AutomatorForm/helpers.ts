export const getBetTextFromInput = (amount: string, target: string): string => {
  return `!${amount} ${target}`;
};

export const getFightTextFromInput = (fighterType: string): string => {
  return `!fight ${fighterType}`;
};

export enum TabItems {
  "BETTING" = "Betting",
  "FIGHTING" = "Fighting",
}

type SelectOption = {
  label: string;
  value: string;
};

export const betAmounts: SelectOption[] = [
  {
    label: "Floor",
    value: "betf",
  },
  {
    label: "2x Floor",
    value: "bet 2f",
  },
  {
    label: "All In",
    value: "allin",
  },
  {
    label: "Half In",
    value: "halfin",
  },
  {
    label: "10%",
    value: "bet 10%",
  },
  {
    label: "25%",
    value: "bet 25%",
  },
];

export const betTargets: SelectOption[] = [
  {
    label: "Random",
    value: "random",
  },
  {
    label: "Team 1",
    value: "left",
  },
  {
    label: "Team 2",
    value: "right",
  },
  {
    label: "Underdog",
    value: "dog",
  },
];

export enum FighterTypes {
  "HUMAN" = "Human",
  "MONSTER" = "Monster",
}

export const jobs: SelectOption[] = [
  { label: "Squire", value: "squire" },
  { label: "Chemist", value: "chemist" },
  { label: "Knight", value: "knight" },
  { label: "Archer", value: "archer" },
  { label: "Monk", value: "monk" },
  { label: "Priest", value: "priest" },
  { label: "Wizard", value: "wizard" },
  { label: "Time Mage", value: "timemage" },
  { label: "Summoner", value: "summoner" },
  { label: "Thief", value: "thief" },
  { label: "Mediator", value: "mediator" },
  { label: "Oracle", value: "oracle" },
  { label: "Geomancer", value: "geomancer" },
  { label: "Lancer", value: "lancer" },
  { label: "Samurai", value: "samurai" },
  { label: "Ninja", value: "ninja" },
  { label: "Calculator", value: "calculator" },
  { label: "Dancer", value: "dancer" },
  { label: "Bard", value: "bard" },
  { label: "Mime", value: "mime" },
];

export const monsters: SelectOption[] = [
  { label: "Dark Behemoth", value: "darkbehemoth" },
  { label: "Ultima Demon", value: "ultimademon" },
  { label: "Tiamat", value: "tiamat" },
  { label: "Holy Dragon", value: "holydragon" },
  { label: "Steel Giant", value: "steelgiant" },
  { label: "Red Dragon", value: "reddragon" },
  { label: "Red Chocobo", value: "redchocobo" },
  { label: "Archaic Demon", value: "archaicdemon" },
  { label: "Blue Dragon", value: "bluedragon" },
  { label: "King Behemoth", value: "kingbehemoth" },
  { label: "Dragon", value: "dragon" },
  { label: "Serpentarius", value: "serpentarius" },
  { label: "Hydra", value: "hydra" },
  { label: "Wyvern", value: "wyvern" },
  { label: "Byblos", value: "byblos" },
  { label: "Behemoth", value: "behemoth" },
  { label: "Apanda", value: "apanda" },
  { label: "Cockatrice", value: "cockatrice" },
  { label: "Sekhret", value: "sekhret" },
  { label: "Minotaur", value: "minotaur" },
  { label: "Bull Demon", value: "bulldemon" },
  { label: "Coeurl", value: "coeurl" },
  { label: "Black Chocobo", value: "blackchocobo" },
  { label: "Vampire", value: "vampire" },
  { label: "Mindflayer", value: "mindflayer" },
  { label: "Taiju", value: "taiju" },
  { label: "Reaper", value: "reaper" },
  { label: "Explosive", value: "explosive" },
  { label: "Plague", value: "plague" },
  { label: "Draugr", value: "draugr" },
  { label: "Juravis", value: "juravis" },
  { label: "Wild Boar", value: "wildboar" },
  { label: "Treant", value: "treant" },
  { label: "Revenant", value: "revenant" },
  { label: "Skeleton", value: "skeleton" },
  { label: "Red Panther", value: "redpanther" },
  { label: "Grenade", value: "grenade" },
  { label: "Bomb", value: "bomb" },
  { label: "Porky", value: "porky" },
  { label: "Ghost", value: "ghost" },
  { label: "Ahriman", value: "ahriman" },
  { label: "Iron Hawk", value: "ironhawk" },
  { label: "Gobbledeguck", value: "gobbledeguck" },
  { label: "Great Malboro", value: "greatmalboro" },
  { label: "Chocobo", value: "Chocobo" },
  { label: "Black Goblin", value: "blackgoblin" },
  { label: "Dryad", value: "dryad" },
  { label: "Swine", value: "swine" },
  { label: "Ghoul", value: "ghoul" },
  { label: "Ochu", value: "ochu" },
  { label: "Goblin", value: "goblin" },
  { label: "Squidraken", value: "squidraken" },
  { label: "Pisco Demon", value: "piscodemon" },
  { label: "Malboro", value: "malboro" },
  { label: "Floating Eye", value: "floatingeye" },
];

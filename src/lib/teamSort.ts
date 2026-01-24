import { roleText } from "./normalize";

type Person = {
  name?: string;
  role?: any;
};

const roleRank = (person: Person) => {
  const role = (roleText(person.role) || "").toLowerCase();
  if (!role) return 9;

  if (role.includes("news director") && !role.includes("assistant")) return 0;
  if (role.includes("assistant news director")) return 1;
  if (role.includes("technical director")) return 2;
  if (role.includes("social media director")) return 3;
  if (role.includes("executive producer")) return 4;
  if (role.includes("associate producer")) return 5;
  if (role.includes("web producer")) return 6;
  if (role.includes("reporter")) return 7;

  return 8;
};

const nameKey = (person: Person) => (person.name || "").toLowerCase();

export const sortTeam = (team: Person[]) =>
  [...team].sort((a, b) => {
    const rankDiff = roleRank(a) - roleRank(b);
    if (rankDiff) return rankDiff;
    return nameKey(a).localeCompare(nameKey(b));
  });

export type SquadMember = {
  id: string;
  x: number;
  y: number;
  leader: boolean;
};

export type SquadMemberMap = {
  [id: string]: SquadMember;
};

export type Squad = {
  id: string;
  name: string;
  emblem: string;
  members: SquadMemberMap;
};

export type SquadMap = {
  [id: string]: Squad;
};

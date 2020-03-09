export type Player = {
  id: string;
  name: string;
  gold: number;
  iventory: {
    [itemId: string]: number;
  };
};

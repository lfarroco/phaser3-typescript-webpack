export const NOT_IMPLEMENTED = 'NOT_IMPLEMENTED';
export const INVALID_STATE = 'INVALID_STATE';

export const error = (type: string) => {
  throw new Error(type);
};

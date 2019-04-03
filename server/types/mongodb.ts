export type Stats = {
  line: {
    [date: string]: number;
  };
  total: {
    sum: number;
    since: string;
  };
};

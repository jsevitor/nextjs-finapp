export type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
};

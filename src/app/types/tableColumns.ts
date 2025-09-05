export type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
};

export type HeaderTitleProps = {
  title: string;
  children?: React.ReactNode;
};

export default function HeaderTitle({ title, children }: HeaderTitleProps) {
  return (
    <div className="flex items-end gap-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      <span>{children}</span>
    </div>
  );
}

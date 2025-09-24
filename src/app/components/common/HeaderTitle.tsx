export type HeaderTitleProps = {
  title: string;
  children?: React.ReactNode;
};

export default function HeaderTitle({ title, children }: HeaderTitleProps) {
  return (
    <div className="flex items-end gap-4 text-sidebar-accent-foreground">
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      <span>{children}</span>
    </div>
  );
}

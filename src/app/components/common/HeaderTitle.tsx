type HeaderTitleProps = {
  title: string;
};

export default function HeaderTitle({ title }: HeaderTitleProps) {
  return <h1 className="text-4xl font-bold">{title}</h1>;
}

type PageContainerProps = {
  children: React.ReactNode;
};
export default function PageContainer({ children }: PageContainerProps) {
  return <div className="flex flex-col gap-2 2xl:gap-4">{children}</div>;
}

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full mb-3 mt-2 ${className}`}
    >
      {children}
    </header>
  );
}

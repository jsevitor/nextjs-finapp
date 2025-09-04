type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between w-full mb-4 ${className}`}
    >
      {children}
    </header>
  );
}

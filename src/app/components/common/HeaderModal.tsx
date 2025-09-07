import { HeaderTitleProps } from "./HeaderTitle";

export default function HeaderModal({ title, children }: HeaderTitleProps) {
  return (
    <div className="flex items-end gap-4 mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <span>{children}</span>
    </div>
  );
}

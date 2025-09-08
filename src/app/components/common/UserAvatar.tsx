import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  url: string;
};

export default function UserAvatar({ url }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={url} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
